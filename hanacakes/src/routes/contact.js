const router = require('express').Router();
const contactRepository = require('../repositories/contact');
const captchaRepository = require('../repositories/captcha');

router.get('/kontakt', (req, res) => {
  const captcha = captchaRepository.createCaptcha(req.session.captcha);
  res.render('pages/contact', {
    banner: 'Kontakt',
    captcha,
    seo: {
      title: 'Kontakt | Hana Cakes',
      description:
        'Kontaktuj Hanu a ona ti s radosťou napečie sladké dobroty  pripravené z láskou.'
    }
  });
});

router.post('/kontakt', async (req, res, next) => {
  try {
    const { captchaId, captchaText, ...form } = req.body;
    const verificationFailed = !captchaRepository.verifyCaptcha({
      id: captchaId,
      storage: req.session.captcha,
      text: captchaText
    });
    if (verificationFailed) {
      req.flash('danger', 'Zle opísaný kód z obrázku. Skúste to prosím znova.');
      return res.redirect('/kontakt');
    }
    await contactRepository.sendEmail(form);
    req.flash('success', 'Ďakujeme za Vášu správu. Ozveme sa Vám čo najskôr.');
    res.redirect('/kontakt');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
