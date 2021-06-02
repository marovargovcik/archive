import util from 'util';

import redis from 'redis';

import config from './config';

const redisConfig = config.redis.url
  ? {
      url: config.redis.url,
    }
  : {
      host: config.redis.host,
      port: config.redis.port,
    };

const client = redis.createClient(redisConfig);

const del = util.promisify(client.del).bind(client);
const get = util.promisify(client.get).bind(client);
const set = util.promisify(client.set).bind(client);

export { client, del, get, set };
