require('dotenv').config();

const axios = require('axios').default;
const sessionFactory = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(sessionFactory);

const dbConfig = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
};

if (process.env.NODE_ENV !== 'development') {
  dbConfig.connection.ssl = {
    rejectUnauthorized: false,
  };
}

const db = require('knex')(dbConfig);

const redisClient = redis.createClient(process.env.REDIS_URL);

const session = sessionFactory({
  cookie: { maxAge: 1209600000 },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET,
  store: new RedisStore({ client: redisClient }),
});

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

const trakt = axios.create({
  baseURL: 'https://api.trakt.tv/',
  headers: {
    'trakt-api-key': process.env.TRAKT_TV_CLIENT_ID,
  },
});

module.exports = {
  db,
  redisClient,
  session,
  tmdb,
  trakt,
};
