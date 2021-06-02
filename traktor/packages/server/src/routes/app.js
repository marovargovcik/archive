const path = require('path');
const router = require('express').Router();

const { ensureLoggedIn } = require('../repositories/auth');

router.get(['/app', '/app/*'], ensureLoggedIn, function (req, res) {
  res.cookie('userSlug', req.user.slug);
  res.sendFile(path.resolve('public/spa/index.html'));
});

module.exports = router;
