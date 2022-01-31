import type { Channel, Connection } from 'amqplib';
import amqp from 'amqplib';

let channel: Channel;
let connection: Connection;

const closeRabbitMQ = async () => {
  await channel.close();
  await connection.close();
};

const initializeRabbitMQ = async (...callbacks: Array<() => Promise<void>>) => {
  connection = await amqp.connect(process.env.RABBITMQ_ENDPOINT as string);
  channel = await connection.createChannel();
  await channel.prefetch(1);
  for (const callback of callbacks) {
    await callback();
  }
};

export { channel, closeRabbitMQ, connection, initializeRabbitMQ };
