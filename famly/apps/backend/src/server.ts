import 'dotenv/config';

import http from 'node:http';

import { app } from '@/app';

const server = http.createServer(app);

server.listen(process.env.PORT);

process.on('SIGTERM', () => server.close());
