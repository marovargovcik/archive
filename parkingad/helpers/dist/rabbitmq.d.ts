import type { Channel, Connection } from 'amqplib';
declare let channel: Channel;
declare let connection: Connection;
declare const closeRabbitMQ: () => Promise<void>;
declare const initializeRabbitMQ: (...callbacks: Array<() => Promise<void>>) => Promise<void>;
export { channel, closeRabbitMQ, connection, initializeRabbitMQ };
//# sourceMappingURL=rabbitmq.d.ts.map