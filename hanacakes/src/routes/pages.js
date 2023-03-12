const router = require('express').Router();
const pagesRepository = require('../repositories/pages');

router.get('/stranky/:page', async (req, res, next) => {
  const { page: slug } = req.params;
  try {
    const page = await pagesRepository.getPage(slug);
    const {
      fields: { name, seoDescription }
    } = page;
    res.render('pages/page', {
      page,
      banner: name,
      seo: {
        title: `${name} | Hana Cakes`,
        description: seoDescription
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
