const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');
const { contentful } = require('../clients');

const getBlogPosts = async () => {
  const query = {
    content_type: 'blogPosts',
    order: '-sys.createdAt'
  };
  const posts = await contentful.getEntries(query);
  return posts.items;
};

const getBlogPost = async slug => {
  const query = {
    content_type: 'blogPosts',
    'fields.slug': slug
  };
  const posts = await contentful.getEntries(query);
  if (isEmpty(posts.items)) {
    throw createError(404, 'Prispevok na blogu nebol nájdeny.');
  }
  return posts.items[0];
};

const getBlogPostsForSitemap = async () => {
  const query = {
    content_type: 'blogPosts',
    select: 'sys.updatedAt,fields.slug'
  };
  const posts = await contentful.getEntries(query);
  return posts.items;
};

module.exports = {
  getBlogPosts,
  getBlogPostsForSitemap,
  getBlogPost
};
