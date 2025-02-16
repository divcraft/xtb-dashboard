import WebSocket from 'ws';
import { classifyMessage } from '../utils/messageClassifier';
import type { ConfigType } from '../../config';
import type { LoginResponseType } from '../../domain/schemas/Login.schema';
import type { TradesResponseType } from '../../domain/schemas/Trades.schema';
import type { ContextType, StateType } from '../../main';
import { TradeModel } from '../../domain/models/Trade.model';
import { SymbolModel } from '../../domain/models/Symbol.model';
import type { SymbolResponseType } from '../../domain/schemas/Symbol.schema';

export type MessageData = LoginResponseType | TradesResponseType | SymbolResponseType;

export class XTBWebSocketService {
  private readonly config: ConfigType;
  private readonly state: StateType;
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private requestQueue = new Map<string, (_response: MessageData | null) => void>();

  private constructor(context: ContextType) {
    this.config = context.config;
    this.state = context.state;
    this.connect();
  }

  public static init(context: ContextType): XTBWebSocketService {
    return new XTBWebSocketService(context);
  }

  private connect(): void {
    this.ws = new WebSocket(this.config.xtb.hostUrl);

    this.ws.on('open', () => {
      console.info('Connected to broker');
      this.login();
    });

    this.ws.on('message', (data) => {
      this.receiveMessage(data.toString());
    });

    this.ws.on('close', () => {
      console.warn('Connection lost. Reconnecting in 3 seconds...');
      this.sessionId = null;
      setTimeout(() => this.connect(), 3000);
    });
  }

  private async sendMessage(command: string, argumentsObj: object = {}): Promise<null> {
    return new Promise((resolve, reject) => {
      const requestId = `${Date.now()}-${Math.random()}`;

      console.info(`Sent message ${command}`);

      this.requestQueue.set(requestId, () => resolve(null));

      this.ws?.send(JSON.stringify({ command, arguments: argumentsObj }));

      setTimeout(() => {
        if (this.requestQueue.has(requestId)) {
          this.requestQueue.delete(requestId);
          reject(new Error('Timeout waiting for response'));
        }
      }, 10000);
    });
  }

  private receiveMessage(data: string): void {
    const message: unknown = JSON.parse(data);
    const parsedMessage = classifyMessage(message);

    if (parsedMessage === null) {
      return;
    }

    const { type, data: parsedData } = parsedMessage;

    console.info(`Received message ${type}`);

    if (type === 'login') {
      this.sessionId = parsedData.streamSessionId;
      this.getTrades();
      setTimeout(() => {
        this.getTradesHistory();
      }, 500);
    }

    if (type === 'trades') {
      for (const trade of parsedData.returnData) {
        if (this.state.trades.map((t) => t.id).includes(trade.order)) {
          return;
        }
        setTimeout(() => {
          if (trade.symbol !== null && this.state.symbols.has(trade.symbol) === false) {
            this.getSymbol(trade.symbol);
          }
        }, 1000);
        const tradeModel = new TradeModel(trade);
        if (tradeModel.symbolKey !== null) {
          const symbolModel = this.state.symbols.get(tradeModel.symbolKey) ?? null;
          tradeModel.updateSymbol(symbolModel);
        }
        this.state.trades.push(tradeModel);
      }
    }

    if (type === 'symbol') {
      const symbolModel = new SymbolModel(parsedData.returnData);

      if (this.state.symbols.has(symbolModel.key) === false) {
        this.state.symbols.set(symbolModel.key, symbolModel);
      }

      for (const trade of this.state.trades) {
        if (trade.symbol === null && trade.symbolKey === symbolModel.key) {
          trade.updateSymbol(symbolModel);
        }
      }
    }

    for (const [key, resolve] of this.requestQueue) {
      resolve(parsedData);
      this.requestQueue.delete(key);
    }
  }

  private async login(): Promise<void> {
    await this.sendMessage('login', {
      userId: this.config.xtb.userId,
      password: this.config.xtb.password,
    });
  }

  private async getTrades(): Promise<void> {
    await this.sendMessage('getTrades', {
      openedOnly: false,
    });
  }

  private async getTradesHistory(): Promise<void> {
    await this.sendMessage('getTradesHistory', {
      end: 0,
      start: 1275993488000,
    });
  }

  private async getSymbol(symbol: string): Promise<void> {
    await this.sendMessage('getSymbol', {
      symbol,
    });
  }
}
