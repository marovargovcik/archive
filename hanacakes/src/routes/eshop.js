const createError = require('http-errors');
const router = require('express').Router();
const cache = require('../cache');
const categoriesRepository = require('../repositories/categories');
const productsRepository = require('../repositories/products');

const findCategory = (slug, categories) => {
  const category = categories.find(c => c.fields.slug === slug);
  if (!category) {
    throw createError(404, 'Kategória nebola nájdená.');
  }
  return category;
};

/**
 * Middleware. Load list of categories.
 */
router.use(async (req, res, next) => {
  try {
    let categories = cache.get('categories');
    if (!categories) {
      categories = await categoriesRepository.getCategories();
      cache.set('categories', categories);
    }
    req.categories = categories;
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * [GET] Menu of products.
 * @param req
 * @param res
 * @param next
 */
router.get('/eshop', async (req, res, next) => {
  try {
    res.render('pages/eshop', {
      banner: 'E-shop',
      categories: req.categories,
      products: await productsRepository.getProducts(),
      seo: {
        title: 'Všetky produkty | Hana Cakes',
        description:
          'Objednajte si z pohodlia domova rýchlo a jednoducho. Stačí si vybrať z našej širokej ponuky od teraz na našom e-shope.'
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * [GET] Products within selected category.
 */
router.get('/eshop/:category', async (req, res, next) => {
  const { category: slug } = req.params;
  try {
    const {
      fields: {
        name,
        seoDescription,
        image: {
          fields: {
            file: { url: categoryImageUrl }
          }
        }
      }
    } = findCategory(slug, req.categories);
    res.render('pages/eshop', {
      banner: name,
      categories: req.categories,
      products: await productsRepository.getProductsInCategory(slug),
      seo: {
        title: `${name} | Hana Cakes`,
        description: seoDescription,
        image: categoryImageUrl
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * [GET] Single product.
 */
router.get('/eshop/produkt/:product', async (req, res, next) => {
  const { product: slug } = req.params;
  try {
    const product = await productsRepository.getProduct(slug);
    const {
      fields: {
        name,
        seoDescription,
        price,
        image: {
          fields: {
            file: { url: productImageUrl }
          }
        }
      }
    } = product;
    res.render('pages/product', {
      product,
      categories: req.categories,
      banner: name,
      seo: {
        price,
        title: `${name} | Hana cakes`,
        description: seoDescription,
        image: productImageUrl
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
