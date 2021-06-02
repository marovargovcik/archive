require('dotenv').config();
const path = require('path');

const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');

const graphql = require('./graphql');
const createLoaders = require('./loaders');
const restapi = require('./restapi');

const app = express();

app.set('port', process.env.PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data loaders middleware
app.use((req, res, next) => {
  req.loaders = createLoaders();
  next();
});

// GraphQL
app.use(graphql);

// REST API
app.use(restapi);

// Docs
app.get(['/', '/docs'], (req, res) => {
  res.sendFile(path.join(__dirname, './docs.html'));
});

app.use(function (req, res, next) {
  res.status(404).send('404');
});

module.exports = app;
