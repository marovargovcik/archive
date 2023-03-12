const cache = require('../cache');
const instagramRepository = require('../repositories/instagram');

module.exports = async (req, res, next) => {
  try {
    let instagramPosts = cache.get('instagramPosts');
    if (!instagramPosts) {
      instagramPosts = await instagramRepository.getPosts();
      cache.set('instagramPosts', instagramPosts);
    }
    res.locals = {
      ...res.locals,
      instagramPosts
    };
    next();
  } catch (err) {
    next(err);
  }
};
