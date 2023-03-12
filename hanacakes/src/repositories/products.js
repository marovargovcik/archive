const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');
const { contentful } = require('../clients');

const getProduct = async slug => {
  const query = {
    content_type: 'products',
    'fields.slug': slug
  };
  const products = await contentful.getEntries(query);
  if (isEmpty(products.items)) {
    throw createError(404, 'Produkt nebol nájdeny.');
  }
  return products.items[0];
};

const getProducts = async () => {
  const query = {
    content_type: 'products',
    order: 'fields.order',
    'fields.active': true
  };
  const products = await contentful.getEntries(query);
  return products.items;
};

const getProductsInCategory = async categorySlug => {
  const query = {
    content_type: 'products',
    order: 'fields.order',
    'fields.category.sys.contentType.sys.id': 'categories',
    'fields.category.fields.slug': categorySlug,
    'fields.active': true
  };
  const products = await contentful.getEntries(query);
  return products.items;
};

const getProductsById = async ids => {
  const query = {
    content_type: 'products',
    'sys.id[in]': ids.join(',')
  };
  const products = await contentful.getEntries(query);
  return products.items;
};

const getProductsByIdForPriceCalculation = async ids => {
  const query = {
    content_type: 'products',
    select: 'sys.id,fields.price',
    'sys.id[in]': ids.join(',')
  };
  const products = await contentful.getEntries(query);
  return products.items;
};

const getProductsForSitemap = async () => {
  const query = {
    content_type: 'products',
    select: 'sys.updatedAt,fields.slug',
    'fields.active': true
  };
  const products = await contentful.getEntries(query);
  return products.items;
};

module.exports = {
  getProduct,
  getProducts,
  getProductsInCategory,
  getProductsById,
  getProductsByIdForPriceCalculation,
  getProductsForSitemap
};
