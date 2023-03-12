const router = require('express').Router();
const showcasesRepository = require('../repositories/showcases');

/**
 * [GET] Homepage.
 * @param req
 * @param res
 * @param next
 */
router.get('/', async (req, res, next) => {
  try {
    const { sendGAdConversion } = req.session;
    if (sendGAdConversion) delete req.session.sendGAdConversion;
    res.render('pages/index', {
      sendGAdConversion: sendGAdConversion || '',
      banner: null,
      seo: {
        title: 'Hana cakes | Sladká výroba',
        description:
          'Sme cukrárenská výroba v Sabinove. Pečieme moderné torty, mini dezerty, klasické zákusky, candy bary a kopec iného. Radi napečieme aj pre Vás.'
      },
      showcases: await showcasesRepository.getShowcases()
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
