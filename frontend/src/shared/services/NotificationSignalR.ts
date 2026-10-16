import * as signalR from '@microsoft/signalr'
import { AppNotification } from './notificationService'

class NotificationSignalRService {
  private connection: signalR.HubConnection | null = null
  private token: string | null = null
 
  private activeCallback: ((n: AppNotification) => void) | null = null

  async connect(token: string) {
    this.token = token

    if (
      this.connection?.state === signalR.HubConnectionState.Connected ||
      this.connection?.state === signalR.HubConnectionState.Connecting
    ) {
      console.log('[SignalR] Već spojen ili se spaja, preskačem dupliranje.')
      return
    }

    if (this.connection) {
      await this.disconnect()
    }

    const HUB_URL = import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/hubs/notifications`
      : 'http://localhost:5000/hubs/notifications'

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => this.token ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build()

    this.registerLifecycleHooks()

    console.log('[SignalR] Connecting...', HUB_URL)

    try {
      await this.connection.start()
      console.log('[SignalR] Connected successfully!')
      
      this.bindNotificationHandler()
    } catch (err) {
      console.error('[SignalR] Initial connect failed:', err)
      await this.retryConnect()
    }
  }

  private registerLifecycleHooks() {
    if (!this.connection) return

    this.connection.onreconnecting((err) => {
      console.warn('[SignalR] Connection lost. Reconnecting...', err)
    })

    this.connection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnected successfully. Connection ID:', connectionId)
      
      this.bindNotificationHandler()
    })

    this.connection.onclose((err) => {
      console.error('[SignalR] Connection closed permanently.', err)
    })
  }

  private async retryConnect() {
    if (!this.connection || !this.token) return

    if (!this.connection || !this.token || this.connection.state !== signalR.HubConnectionState.Disconnected) {
      return
    }

    let retry = 0
    const maxRetries = 5

    while (retry < maxRetries) {
      try {
        retry++
        console.log(`[SignalR] Attempting initial connection retry ${retry}/${maxRetries}...`)
        await new Promise(r => setTimeout(r, 1500 * retry))

        await this.connection.start()
        console.log('[SignalR] Connected after manual retry!')
        
        this.bindNotificationHandler()
        return
      } catch (err) {
        console.warn(`[SignalR] Retry ${retry} failed:`, err)
      }
    }

    console.error('[SignalR] Could not establish connection after maximum retries.')
  }

  
  private bindNotificationHandler() {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      return
    }

    this.connection.off('ReceiveNotification')
    
    this.connection.on('ReceiveNotification', (data: AppNotification) => {
      console.log('[SignalR] Nova notifikacija stigla sa bekenda:', data)
      this.activeCallback?.(data)
    })
  }

  onNotification(callback: (n: AppNotification) => void) {
    this.activeCallback = callback
    
    this.bindNotificationHandler()
  }

  offNotification() {
    this.activeCallback = null
    this.connection?.off('ReceiveNotification')
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.stop()
      }
    } catch (e) {
      console.warn('[SignalR] Error while disconnecting:', e)
    } finally {
      this.connection = null
      this.activeCallback = null
      this.token = null
    }
  }
}

export const notificationSignalRService = new NotificationSignalRService()