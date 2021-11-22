import http from 'node:http';

import { app } from './app';

const server = http.createServer(app);

server.listen(3_000);

process.on('exit', () => {
  // eslint-disable-next-line no-console
  console.log('Closing...');
  server.close();
});
