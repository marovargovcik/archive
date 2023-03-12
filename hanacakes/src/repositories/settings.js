const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');

const { contentful } = require('../clients');

const getSettingById = async id => {
  const query = {
    content_type: 'settings',
    'fields.id': id
  };
  const settings = await contentful.getEntries(query);
  if (isEmpty(settings.items)) {
    throw createError(404, 'Nastavenie nebolo nájdené.');
  }
  return settings.items[0];
};

module.exports = {
  getSettingById
};
