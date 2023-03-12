const router = require('express').Router();
const isEmpty = require('lodash/isEmpty');
const multer = require('multer');
const pify = require('pify');
const cartRepository = require('../repositories/cart');
const orderRepository = require('../repositories/orders');
const productsRepository = require('../repositories/products');
const logsRepository = require('../repositories/logs');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }
}).array('attachments', 3);

router.get('/nakupny-kosik', async (req, res) => {
  res.render('pages/cart', {
    banner: 'Nákupný košík',
    cart: {
      ...req.session.cart,
      products: await productsRepository.getProductsById(
        req.session.cart.allIds
      )
    },
    cartAdditionalFields: await cartRepository.getCartAdditionalFields(),
    seo: {
      title: 'Nákupný košík | Hana cakes',
      description: 'Tu nájdete dobroty, ktoré ste si pridali do košíka.'
    }
  });
});

router.post('/nakupny-kosik/pridat-produkt', (req, res) => {
  const { id, quantity, _csrf, ...configuration } = req.body;
  const { returnTo } = req.query;
  cartRepository.addProduct(
    req.session.cart,
    id,
    parseInt(quantity, 10),
    isEmpty(configuration) ? null : configuration
  );
  req.flash('success', 'Produkt bol pridaný do košíka.');
  res.redirect(returnTo);
});

router.post('/nakupny-kosik/zmazat-produkt', (req, res) => {
  const { id } = req.body;
  const { returnTo } = req.query;
  cartRepository.removeProduct(req.session.cart, id);
  req.flash('success', 'Produkt bol z košíka odobraný.');
  res.redirect(returnTo);
});

router.post('/nakupny-kosik/zmazat-konfiguraciu', (req, res) => {
  const { id, configuration } = req.body;
  const { returnTo } = req.query;
  cartRepository.removeProductConfiguration(
    req.session.cart,
    id,
    configuration
  );
  req.flash('success', 'Produkt bol z košíka odobraný.');
  res.redirect(returnTo);
});

router.post('/nakupny-kosik/zmenit-pocet-kusov', (req, res) => {
  const { id, quantity, configuration } = req.body;
  const { returnTo } = req.query;
  cartRepository.changeProductQuantity(
    req.session.cart,
    id,
    parseInt(quantity, 10),
    configuration
  );
  res.redirect(returnTo);
});

router.post('/nakupny-kosik/odoslat-objednavku', async (req, res, next) => {
  try {
    await pify(upload)(req, res);
    const order = req.body;
    const additionalInformation = await cartRepository.processCartAdditionalFields(
      req.body
    );
    const id = await orderRepository.getNextOrderId();
    const attachments = req.files.length
      ? await orderRepository.uploadAttachment({
          id,
          files: req.files
        })
      : null;
    const pinCode = orderRepository.generatePinCode();
    const { allIds, quantityById, configurationById } = req.session.cart;
    await orderRepository.saveOrder({
      ...order,
      id,
      additionalInformation,
      attachments,
      encryptedPinCode: await orderRepository.encryptPinCode(pinCode),
      items: {
        allIds,
        quantityById,
        configurationById
      },
      price: req.session.cart.totalPrice
    });
    await orderRepository.sendNoticeEmail(id);
    await orderRepository.sendConfirmationEmail(id, pinCode, order.email);
    delete req.session.cart;
    req.session.sendGAdConversion = id;
    res.redirect('/dakujeme-za-objednavku');
  } catch (err) {
    try {
      await logsRepository.logErrorAndNotify(err.message);
      console.error(err);
      req.flash(
        'danger',
        'Nastala chyba pri vytváraní objednávky, ktorú sme zaznamenali. Skúste to prosím znova.'
      );
      res.redirect('/nakupny-kosik');
    } catch (e) {
      return next(e);
    }
  }
});

router.get('/dakujeme-za-objednavku', (req, res) => {
  req.flash('success', 'Ďakujeme Vám za Vašu objednávku.');
  res.redirect('/');
});

module.exports = router;
