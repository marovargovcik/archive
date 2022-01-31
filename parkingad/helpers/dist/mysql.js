"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysql = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    port: Number.parseInt(process.env.MYSQL_PORT, 10),
    user: process.env.MYSQL_USERNAME,
});
exports.mysql = pool;
