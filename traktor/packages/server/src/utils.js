const { promisify } = require('util');
const { redisClient } = require('./clients');

const del = promisify(redisClient.del).bind(redisClient);
const get = promisify(redisClient.get).bind(redisClient);
const set = promisify(redisClient.setex).bind(redisClient);

module.exports = {
  redis: {
    del,
    get,
    set,
  },
};
