const passport = require('passport');
const router = require('express').Router();

const { ensureLoggedIn } = require('../repositories/auth');

router.get('/auth/logout', ensureLoggedIn, function (req, res) {
  req.logOut();
  res.redirect('/');
});

router.get('/auth/login', passport.authenticate('trakt'));

router.get(
  '/auth/callback',
  passport.authenticate('trakt'),
  async function (req, res) {
    res.redirect('/app');
  },
);

module.exports = router;
