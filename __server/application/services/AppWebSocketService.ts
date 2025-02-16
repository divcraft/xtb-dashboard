import { type Server, WebSocketServer } from 'ws';
import { type TradeRecord } from '../../domain/schemas/MessageSchemas';
import type { ServerType } from '../../main';

export class AppWebSocketService {
  private wss: Server;

  private constructor(server: ServerType) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws) => {
      console.info('New client connected');
    });
  }

  public static init(server: ServerType): AppWebSocketService {
    return new AppWebSocketService(server);
  }

  forwardTrade(trades: TradeRecord[]): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(trades));
      }
    });
  }
}
