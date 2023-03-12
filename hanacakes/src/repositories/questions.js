const { contentful } = require('../clients');

const getQuestions = async () => {
  const query = {
    content_type: 'questions',
    order: 'fields.order'
  };
  const questions = await contentful.getEntries(query);
  return questions.items;
};

module.exports = {
  getQuestions
};
