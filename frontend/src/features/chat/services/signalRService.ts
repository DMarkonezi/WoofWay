import * as signalR from '@microsoft/signalr'
import { ChatMessage } from './chatService'

const HUB_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/hubs/chat`
  : 'http://localhost:5000/hubs/chat'

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  async connect(token: string): Promise<void> {
      if (this.connection) {
          if (this.connection.state === signalR.HubConnectionState.Connected) {
              console.log("SignalR: Već povezano.");
              return;
          }
          if (this.connection.state === signalR.HubConnectionState.Connecting) {
              console.log("SignalR: Povezivanje u toku...");
              return;
          }
      }

      console.log("SignalR: Kreiram novu konekciju...");
      
      this.connection = new signalR.HubConnectionBuilder()
          .withUrl(HUB_URL, {
              accessTokenFactory: () => token,
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets
          })
          .withAutomaticReconnect()
          .build();

      try {
          await this.connection.start();
          console.log("SignalR: Connected successfully!");
      } catch (err) {
          console.error("SignalR: Greška pri startu:", err);
          this.connection = null;
          throw err;
      }
  }

  async joinRoom(roomId: string): Promise<void> {
    console.log(`SignalR: Pokušavam joinRoom(${roomId})`);
    try {
      await this.connection?.invoke('JoinRoom', roomId);
      console.log(`SignalR: Uspešno joinovan u sobu: ${roomId}`);
    } catch (err) {
      console.error(`SignalR: Greška pri joinRoom(${roomId})`, err);
    }
  }

  async leaveRoom(roomId: string): Promise<void> {
      if (!this.connection) return;
      try {
          await this.connection.invoke("LeaveRoom", roomId);
          console.log(`SignalR: Uspešno napuštena soba: ${roomId}`);
      } catch (err) {
          console.error("SignalR greška pri napuštanju sobe:", err);
      }
  }

  async sendMessage(roomId: string, content: string): Promise<void> {
    console.log(`SignalR: Šaljem poruku u sobu ${roomId}:`, content);
    try {
      await this.connection?.invoke('SendMessage', roomId, content);
      console.log("SignalR: Poruka uspešno poslata serveru.");
    } catch (err) {
      console.error("SignalR: Greška pri slanju poruke:", err);
    }
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.connection?.on('ReceiveMessage', (msg) => {
      console.log("📥 [SIGNALR] Primio sam poruku sa servera:", msg);
      callback(msg);
    });
}

  offMessage(): void {
    console.log("SignalR: Uklanjam listener za ReceiveMessage");
    this.connection?.off('ReceiveMessage');
  }

  async disconnect(): Promise<void> {
      console.log("SignalR: Diskonektujem...");
      await this.connection?.stop();
      this.connection = null;
  }
}

export const signalRService = new SignalRService()