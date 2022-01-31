import http from 'node:http';
import { closeRabbitMQ } from 'parkingad-helpers/rabbitmq';
import { closeRedis } from 'parkingad-helpers/redis';

import { app } from '@/app';

const server = http.createServer(app);

server.listen(process.env.PORT);

process.on('SIGTERM', () => {
  server.close(async () => {
    await closeRedis();
    await closeRabbitMQ();
  });
});
