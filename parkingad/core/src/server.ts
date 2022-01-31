// eslint-disable-next-line import/order
import dotenv from 'dotenv';

dotenv.config();

/* eslint-disable import/first */
import http from 'node:http';
import { closeRabbitMQ } from 'parkingad-helpers/rabbitmq';
import { closeRedis } from 'parkingad-helpers/redis';

import { app } from '@/app';
/* eslint-enable import/first */

const server = http.createServer(app);

server.listen(process.env.PORT);

process.on('SIGTERM', () => {
  server.close(async () => {
    await closeRedis();
    await closeRabbitMQ();
  });
});
