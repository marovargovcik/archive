import { createClient } from '-redis';

const redisWO = createClient({
  url: process.env.REDIS_PRIMARY_ENDPOINT,
});
const redisRO = createClient({
  url: process.env.REDIS_READER_ENDPOINT,
});

const closeRedis = async () => {
  await redisWO.quit();
  await redisRO.quit();
};

const initializeRedis = async () => {
  await redisWO.connect();
  await redisRO.connect();
};

export { closeRedis, initializeRedis, redisRO, redisWO };
