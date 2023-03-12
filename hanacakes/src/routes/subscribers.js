const createError = require('http-errors');
const router = require('express').Router();
const subscribersRepository = require('../repositories/subscribers');

router.post('/prihlasit-odber', async (req, res, next) => {
  const { email } = req.body;
  const { returnTo } = req.query;
  try {
    await subscribersRepository.saveSubscriber(email);
    req.flash(
      'success',
      'Boli ste prihlásený na odber nášho newsletteru. Ďakujeme.'
    );
    res.redirect(returnTo);
  } catch (err) {
    next(
      createError(
        400,
        'Vášu požiadavku sme neboli schopný spracovať. Skúste to prosím neskôr.'
      )
    );
  }
});

module.exports = router;
