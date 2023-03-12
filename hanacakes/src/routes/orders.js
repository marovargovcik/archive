const createError = require('http-errors');
const router = require('express').Router();
const orderRepository = require('../repositories/orders');
const productsRepository = require('../repositories/products');

router.get(['/objednavka', '/objednavka/:id'], async (req, res, next) => {
  const { id } = req.params;
  res.render('pages/order-pin-code-challenge', {
    id,
    banner: `Prihlásenie do objednávky`,
    seo: {
      title: `Prihlásenie do objednávky | Hana Cakes`,
      description:
        'Overte si obsah a stav Vašej objednávky, rýchlo a jednoducho.'
    }
  });
});

router.post('/objednavka', async (req, res, next) => {
  try {
    const { id, pinCode } = req.body;
    const order = await orderRepository.getOrder(id);
    const {
      fields: { items }
    } = order;
    const pinCodeType = await orderRepository.comparePinCode(
      pinCode,
      order.fields.encryptedPinCode
    );
    res.render('pages/order', {
      order,
      pinCodeType,
      banner: `Objednávka číslo ${id}`,
      products: await productsRepository.getProductsById(items.allIds),
      seo: {
        title: `Objednávka číslo ${id} | Hana Cakes`,
        description:
          'Overte si obsah a stav Vašej objednávky, rýchlo a jednoducho.'
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/objednavka/:id/zmenit-stav', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { returnTo } = req.query;
    const { pinCode, status, message } = req.body;
    const {
      sys: { id: entryId },
      fields: { email, encryptedPinCode }
    } = await orderRepository.getOrder(id);
    const pinCodeType = await orderRepository.comparePinCode(
      pinCode,
      encryptedPinCode
    );
    if (pinCodeType !== 'MASTER') {
      next(createError(401, 'Neoprávnený prístup.'));
    }
    await orderRepository.changeOrderStatus(entryId, status);
    await orderRepository.sendStatusChangeEmail({
      id,
      message,
      status,
      recipient: email
    });
    req.flash('success', 'Stav objednávky bol úspešne zmenený.');
    res.redirect(returnTo);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
