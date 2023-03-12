const cache = require('../cache');
const partnersRepository = require('../repositories/partners');

module.exports = async (req, res, next) => {
  try {
    let partners = cache.get('partners');
    if (!partners) {
      partners = await partnersRepository.getPartners();
      cache.set('partners', partners);
    }
    res.locals = {
      ...res.locals,
      partners
    };
    next();
  } catch (err) {
    next(err);
  }
};
