const { contentful } = require('../clients');

const getPartners = async () => {
  const query = {
    content_type: 'partners'
  };
  const partners = await contentful.getEntries(query);
  return partners.items;
};

module.exports = {
  getPartners
};
