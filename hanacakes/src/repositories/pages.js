const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');
const { contentful } = require('../clients');

const getPages = async () => {
  const query = {
    content_type: 'pages',
    select: 'fields.name,fields.slug',
    order: 'fields.order'
  };
  const pages = await contentful.getEntries(query);
  return pages.items;
};

const getPage = async slug => {
  const query = {
    content_type: 'pages',
    'fields.slug': slug
  };
  const pages = await contentful.getEntries(query);
  if (isEmpty(pages.items)) {
    throw createError(404, 'Produkt nebol nájdeny.');
  }
  return pages.items[0];
};

module.exports = {
  getPages,
  getPage
};
