const cache = require('../cache');
const pagesRepository = require('../repositories/pages');

module.exports = async (req, res, next) => {
  try {
    let pages = cache.get('pages');
    if (!pages) {
      pages = await pagesRepository.getPages();
      cache.set('pages', pages);
    }
    res.locals = {
      ...res.locals,
      pages
    };
    next();
  } catch (err) {
    next(err);
  }
};
