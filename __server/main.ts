import express from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { getConfig, type ConfigType } from './config';
// import { AppWebSocketService } from './application/services/AppWebSocketService';
import { XTBWebSocketService } from './application/services/XTBWebSocketService';
import dotenv from 'dotenv';
import type { TradeModel } from './domain/models/Trade.model';
import type { SymbolModel } from './domain/models/Symbol.model';

export type ServerType = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

export type StateType = {
  trades: Array<TradeModel>;
  symbols: Map<string, SymbolModel>;
};

export type ContextType = {
  config: ConfigType;
  state: StateType;
};

const main = (): void => {
  dotenv.config();
  const app = express();
  // const server = http.createServer(app);

  const PORT = 4040;
  const config = getConfig();
  const state: StateType = {
    trades: [],
    symbols: new Map(),
  };

  const context: ContextType = {
    config,
    state,
  };

  // AppWebSocketService.init(server);
  XTBWebSocketService.init(context);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../__client/dist')));
  app.use(cors());

  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
  });

  app.get('/trades', (req, res) => {
    const resBody = context.state.trades.map((trade) => trade.toResponse());
    res.json(resBody);
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../__client/dist/index.html'));
  });

  app.listen(PORT, () => {
    console.info(`Example app listening on port ${PORT}`);
  });
};

main();
