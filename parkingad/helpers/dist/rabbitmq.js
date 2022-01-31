"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRabbitMQ = exports.connection = exports.closeRabbitMQ = exports.channel = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
exports.channel = channel;
let connection;
exports.connection = connection;
const closeRabbitMQ = async () => {
    await channel.close();
    await connection.close();
};
exports.closeRabbitMQ = closeRabbitMQ;
const initializeRabbitMQ = async (...callbacks) => {
    exports.connection = connection = await amqplib_1.default.connect(process.env.RABBITMQ_ENDPOINT);
    exports.channel = channel = await connection.createChannel();
    await channel.prefetch(1);
    for (const callback of callbacks) {
        await callback();
    }
};
exports.initializeRabbitMQ = initializeRabbitMQ;
