const format = require('date-fns/format');
const isEmpty = require('lodash/isEmpty');
const md = require('markdown-it')();

const formatDate = (dateString, includeTime = false) =>
  format(new Date(dateString), `dd.MM.yyyy ${includeTime ? 'HH:mm' : ''}`);

module.exports = (req, res, next) => {
  res.locals = {
    ...res.locals,
    req,
    csrfToken: req.csrfToken(),
    messages: req.flash(),
    utils: {
      formatDate,
      isEmpty,
      md,
      baseUrl: `${process.env.PROTOCOL}://${req.headers.host}`,
      fullUrl: `${process.env.PROTOCOL}://${req.headers.host + req.url}`
    }
  };
  next();
};
