const createError = require('http-errors');
const router = require('express').Router();

const { ensureLoggedIn } = require('../../repositories/auth');
const { getFeed } = require('../../repositories/userActivityLogs');

router.get('/feed', ensureLoggedIn, async function (req, res, next) {
  try {
    const data = await getFeed(req.user.uuid);
    res.json(data);
  } catch (error) {
    next(createError(error));
  }
});

module.exports = router;
