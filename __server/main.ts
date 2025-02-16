import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { getConfig } from './config';
import { AppWebSocketService } from './application/services/AppWebSocketService';
import { XTBWebSocketService } from './application/services/XTBWebSocketService';
import dotenv from 'dotenv';

dotenv.config();

export type ServerType = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const main = (): void => {
  const app = express();
  const server = http.createServer(app);

  const PORT = 4040;
  const config = getConfig();

  AppWebSocketService.init(server);
  XTBWebSocketService.init(config);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../__client/dist')));

  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../__client/dist/index.html'));
  });

  app.listen(PORT, () => {
    console.info(`Example app listening on port ${PORT}`);
  });
};

main();
