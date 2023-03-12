const { contentful } = require('../clients');

const getShowcases = async () => {
  const query = {
    content_type: 'showcase'
  };
  const showcases = await contentful.getEntries(query);
  return showcases.items;
};

module.exports = {
  getShowcases
};
