const router = require('express').Router();
const questionsRepository = require('../repositories/questions');

/**
 * [GET] FAQ.
 * @param req
 * @param res
 * @param next
 */
router.get('/caste-otazky', async (req, res, next) => {
  try {
    const questions = await questionsRepository.getQuestions();
    res.render('pages/faq', {
      questions,
      banner: 'Časté otázky',
      seo: {
        title: 'Časté otázky | Hana cakes',
        description:
          'Pripravili sme pre vás odpovede na najčastejšie kladené otázky. Skôr než sa rozhodnete nás kontaktovať, prezrite si, či sa medzi nimi neskrýva aj odpoveď na Vašu otázku.'
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
