import WebSocket from 'ws';
import { classifyMessage } from '../utils/messageClassifier';
import type { MessageData } from '../../domain/schemas/MessageSchemas';
import type { ConfigType } from '../../config';

export class XTBWebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private brokerUrl: string;
  private requestQueue = new Map<
    string,
    (response: MessageData | null) => void
  >();

  private constructor(private readonly config: ConfigType) {
    this.brokerUrl = this.config.xtb.hostUrl;
    this.connect();
  }

  public static init(config: ConfigType): XTBWebSocketService {
    return new XTBWebSocketService(config);
  }

  private connect(): void {
    this.ws = new WebSocket(this.brokerUrl);

    this.ws.on('open', () => {
      console.info('Connected to broker');
      this.login();
    });

    this.ws.on('message', (data) => {
      this.handleMessage(data.toString());
    });

    this.ws.on('close', () => {
      console.warn('Connection lost. Reconnecting in 3 seconds...');
      this.sessionId = null;
      setTimeout(() => this.connect(), 3000);
    });
  }

  private async sendMessage(
    command: string,
    argumentsObj: object = {},
  ): Promise<null> {
    return new Promise((resolve, reject) => {
      const requestId = `${Date.now()}-${Math.random()}`;

      this.requestQueue.set(requestId, () => resolve(null));

      this.ws?.send(JSON.stringify({ command, arguments: argumentsObj }));

      setTimeout(() => {
        if (this.requestQueue.has(requestId)) {
          this.requestQueue.delete(requestId);
          reject(new Error('Timeout waiting for response'));
        }
      }, 5000);
    });
  }

  private handleMessage(data: string): void {
    const message: unknown = JSON.parse(data);
    const parsedMessage = classifyMessage(message);

    if (parsedMessage === null) {
      return;
    }

    const { type, data: parsedData } = parsedMessage;
    console.info('Received message:', parsedData);

    if (type === 'login') {
      this.sessionId = parsedData.streamSessionId;
      this.fetchTrades();
    }

    for (const [key, resolve] of this.requestQueue) {
      resolve(parsedData);
      this.requestQueue.delete(key);
    }
  }

  async login(): Promise<void> {
    await this.sendMessage('login', {
      userId: this.config.xtb.userId,
      password: this.config.xtb.password,
    });
  }

  async fetchTrades(): Promise<void> {
    await this.sendMessage('getTrades', { openedOnly: true });
  }
}
