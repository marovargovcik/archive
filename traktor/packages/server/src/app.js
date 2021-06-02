require('dotenv').config();

const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');

const { session } = require('./clients');

const {
  Strategy,
  deserializeUser,
  serializeUser,
} = require('./repositories/auth');

passport.use('trakt', Strategy);
passport.deserializeUser(deserializeUser);
passport.serializeUser(serializeUser);

const app = express();

app.set('trust proxy', true);
app.set('views', 'src/views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Api
app.use('/api', require('./routes/api'));

// Routes
app.use(require('./routes'));

app.use((req, res, next) => {
  next(createError(404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: process.env.NODE_ENV === 'development' ? err : {},
    message: err.message,
  });
});

module.exports = app;
