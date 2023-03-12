require('dotenv').config();
const csrf = require('csurf');
const createError = require('http-errors');
const express = require('express');
const flash = require('connect-flash');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const redisClient = redis.createClient();

app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(helmet());
app.use(logger('dev'));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    cookie: {
      maxAge: 1209600000
    },
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
  })
);
app.use(csrf({ cookie: false }));

/**
 * Custom middleware.
 */
const captchaMiddleware = require('./src/middlewares/captcha');
const cartMiddleware = require('./src/middlewares/cart');
const pagesMiddleware = require('./src/middlewares/pages');
const partnersMiddleware = require('./src/middlewares/partners');
const instagramMiddleware = require('./src/middlewares/instagram');
const utilsMiddleware = require('./src/middlewares/utils');

app.use(captchaMiddleware);
app.use(cartMiddleware);
app.use(pagesMiddleware);
app.use(partnersMiddleware);
app.use(instagramMiddleware);
app.use(utilsMiddleware);

/**
 * Routes import.
 */
const index = require('./src/routes/index');
const eshop = require('./src/routes/eshop');
const faq = require('./src/routes/faq');
const cart = require('./src/routes/cart');
const subscribers = require('./src/routes/subscribers');
const orders = require('./src/routes/orders');
const blog = require('./src/routes/blog');
const pages = require('./src/routes/pages');
const sitemap = require('./src/routes/sitemap');
const contact = require('./src/routes/contact');

app.use(index);
app.use(eshop);
app.use(faq);
app.use(cart);
app.use(subscribers);
app.use(orders);
app.use(blog);
app.use(pages);
app.use(sitemap);
app.use(contact);

/**
 * 404 handler.
 */
app.use((req, res, next) => {
  next(createError(404, 'Požadovaná stránka neexistuje.'));
});

/**
 * Error handler.
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    error: process.env.NODE_ENV === 'development' ? err : {},
    message: err.message
  });
});

module.exports = app;
