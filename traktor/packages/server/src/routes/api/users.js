const createError = require('http-errors');
const router = require('express').Router();

const { ensureLoggedIn } = require('../../repositories/auth');
const { getUserBySlug } = require('../../repositories/users');
const {
  follow,
  getFollowers,
  getFollowing,
  unfollow,
} = require('../../repositories/userFollowers');

router.get('/users/:slug', ensureLoggedIn, async function (req, res, next) {
  try {
    const { slug } = req.params;
    const data = await getUserBySlug(slug, true);
    res.status(data ? 204 : 404).send();
  } catch (error) {
    next(createError(error));
  }
});

router.get(
  '/users/:slug/followers',
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { slug } = req.params;
      const data = await getFollowers(slug);
      res.json(data);
    } catch (error) {
      next(createError(error));
    }
  },
);

router.get(
  '/users/:slug/following',
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { slug } = req.params;
      const data = await getFollowing(slug);
      res.json(data);
    } catch (error) {
      next(createError(error));
    }
  },
);

router.delete(
  '/users/:slug/unfollow',
  ensureLoggedIn,
  async function (req, res, next) {
    const { slug } = req.params;
    try {
      await unfollow({ followerUuid: req.user.uuid, slug });
      res.status(204).send();
    } catch (error) {
      next(createError(error));
    }
  },
);

router.post(
  '/users/:slug/follow',
  ensureLoggedIn,
  async function (req, res, next) {
    const { slug } = req.params;
    try {
      await follow({ followerUuid: req.user.uuid, slug });
      res.status(204).send();
    } catch (error) {
      next(createError(error));
    }
  },
);

module.exports = router;
