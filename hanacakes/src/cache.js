const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 1 * 60 });

module.exports = cache;
