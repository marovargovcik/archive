"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisWO = exports.redisRO = exports.initializeRedis = exports.closeRedis = void 0;
const _redis_1 = require("-redis");
const redisWO = (0, _redis_1.createClient)({
    url: process.env.REDIS_PRIMARY_ENDPOINT,
});
exports.redisWO = redisWO;
const redisRO = (0, _redis_1.createClient)({
    url: process.env.REDIS_READER_ENDPOINT,
});
exports.redisRO = redisRO;
const closeRedis = async () => {
    await redisWO.quit();
    await redisRO.quit();
};
exports.closeRedis = closeRedis;
const initializeRedis = async () => {
    await redisWO.connect();
    await redisRO.connect();
};
exports.initializeRedis = initializeRedis;
