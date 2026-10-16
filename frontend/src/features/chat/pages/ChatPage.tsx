import { useEffect, useRef, useState } from 'react'
import { chatService, ChatRoom, ChatMessage } from '../services/chatService'
import { signalRService } from '../services/signalRService'
import { useAuth } from '../../auth/context/AuthContext'

export default function ChatPage() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatService.getMyRooms()
      .then(setRooms)
      .finally(() => setLoadingRooms(false))
  }, [])

  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('woof_token')
    if (!token) return

    let mounted = true

    signalRService.connect(token)
      .then(() => {
        if (!mounted) return
        setConnected(true)

        signalRService.onMessage((message) => {

          console.log("📥 Stigla poruka sa servera:", message);
          setMessages((prev) => [...prev, message])
          scrollToBottom()
          setRooms((prev) =>
            prev.map((r) =>
              r.id === message.chatRoomId
                ? {
                    ...r,
                    lastMessagePreview: message.content,
                    lastMessageAt: message.timestamp,
                  }
                : r
            )
          )
        })
      })
      .catch((err) => {
        console.error('SignalR greška:', err)
      })

    return () => {
      mounted = false
      signalRService.offMessage()
      signalRService.disconnect()
      setConnected(false)
    }
  }, [user])

  const hasAttemptedConnect = useRef(false);

  useEffect(() => {
    
    if (hasAttemptedConnect.current) return;
    
    const token = localStorage.getItem('woof_token');
    if (!token) return;

    hasAttemptedConnect.current = true;
    
    signalRService.connect(token).catch(console.error);

    return () => {
      hasAttemptedConnect.current = false; 
      signalRService.disconnect();
    };
  }, []); 

  useEffect(() => {
    if (!activeRoom || !connected) return;

    setLoadingMessages(true);
    
    chatService.getMessages(activeRoom.id)
      .then((msgs) => {
        setMessages(msgs);
        scrollToBottom();
      })
      .catch(err => console.error("Greška pri učitavanju:", err))
      .finally(() => setLoadingMessages(false));

    signalRService.joinRoom(activeRoom.id);

    return () => {
      signalRService.leaveRoom(activeRoom.id).catch(console.error);
    };
  }, [activeRoom, connected]);

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  async function handleSend() {
    console.log("=== DEBUG SLANJA ===");
    console.log("Input:", input);
    console.log("ActiveRoom:", activeRoom); 
    console.log("Connected:", connected);

    if (!input.trim() || !activeRoom || sending || !connected) {
      console.warn("Slanje blokirano! Uslovi:", { 
        hasInput: !!input.trim(), 
        hasRoom: !!activeRoom, 
        isSending: sending, 
        isConnected: connected 
      });
      return;
    }

    setSending(true);
    try {
      await signalRService.sendMessage(activeRoom.id, input.trim());
      console.log("✅ Poruka poslata");
      setInput('');
    } catch (err) {
      console.error("❌ Greška pri slanju:", err);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">

      <div className="w-72 shrink-0 border-r border-gray-100 bg-white
                      flex flex-col">
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-gray-900">Chat</h1>
            <span className={`w-2 h-2 rounded-full ${
              connected ? 'bg-woof-green-500' : 'bg-gray-300'
            }`} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Vaši razgovori</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingRooms && (
            <div className="space-y-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {!loadingRooms && rooms.length === 0 && (
            <div className="text-center py-12 px-4 text-gray-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-xs">
                Nema aktivnih razgovora. Chat se otvara kada se zahtev odobri.
              </p>
            </div>
          )}

          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50
                         transition-colors hover:bg-gray-50
                         ${activeRoom?.id === room.id ? 'bg-woof-blue-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-woof-blue-100
                                flex items-center justify-center
                                text-woof-blue-600 text-sm shrink-0">
                  💬
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    Zahtev #{room.requestId.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {room.lastMessagePreview}
                  </p>
                </div>
                <p className="text-xs text-gray-300 shrink-0">
                  {new Date(room.lastMessageAt).toLocaleDateString('sr-RS', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {!activeRoom ? (
          <div className="flex-1 flex flex-col items-center justify-center
                          text-gray-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm">Izaberite razgovor</p>
            {!connected && (
              <p className="text-xs mt-2 text-gray-300">Povezivanje...</p>
            )}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-14 bg-white border-b border-gray-100
                            flex items-center px-5 shrink-0">
              <div className="w-8 h-8 rounded-full bg-woof-blue-100
                              flex items-center justify-center
                              text-woof-blue-600 text-sm mr-3">
                💬
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Zahtev #{activeRoom.requestId.slice(-6)}
                </p>
                <p className="text-xs text-gray-400">
                  {activeRoom.participants.length} učesnika
                </p>
              </div>
            </div>

            {/* Poruke */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loadingMessages && (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        i % 2 === 0 ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div className="h-10 w-48 bg-white rounded-xl animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {!loadingMessages && messages.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-sm">Nema poruka. Počnite razgovor!</p>
                </div>
              )}

              {!loadingMessages &&
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl
                                   text-sm leading-relaxed
                                   ${
                                     isMe
                                       ? 'bg-woof-blue-600 text-white rounded-br-sm'
                                       : 'bg-white text-gray-800 shadow-card rounded-bl-sm'
                                   }`}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? 'text-woof-blue-200' : 'text-gray-400'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString('sr-RS', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
              <div className="flex items-end gap-3">
                <textarea
                  rows={1}
                  placeholder="Napišite poruku..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 woof-input resize-none min-h-[40px]
                             max-h-32 py-2.5"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending || !connected}
                  className="p-2.5 bg-woof-blue-600 hover:bg-woof-blue-700
                             text-white rounded-lg transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Enter za slanje · Shift+Enter za novi red
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}