const { contentful } = require('../clients');

const getCategories = async () => {
  const query = {
    content_type: 'categories',
    select:
      'fields.name,fields.slug,fields.seoDescription,fields.image,fields.active',
    order: 'fields.order',
    'fields.active': true
  };
  const categories = await contentful.getEntries(query);
  return categories.items;
};

module.exports = {
  getCategories
};
