const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');

const settingsRepository = require('./settings');

const addProduct = (cart, id, quantity, configuration) => {
  if (quantity <= 0) return;
  if (!cart.allIds.includes(id)) cart.allIds.push(id);
  cart.quantityById[id] = (cart.quantityById[id] || 0) + quantity;
  if (configuration) {
    const configurationKey = JSON.stringify(configuration);
    cart.configurationById[id] = {
      ...cart.configurationById[id],
      [configurationKey]:
        ((cart.configurationById[id] &&
          cart.configurationById[id][configurationKey]) ||
          0) + quantity
    };
  }
};

const removeProduct = (cart, id) => {
  cart.allIds = cart.allIds.filter(iteratedId => iteratedId !== id);
  delete cart.quantityById[id];
  delete cart.configurationById[id];
};

const removeProductConfiguration = (cart, id, configuration) => {
  const quantity = cart.configurationById[id][configuration];
  delete cart.configurationById[id][configuration];
  if (isEmpty(cart.configurationById[id])) {
    delete cart.configurationById[id];
  }
  cart.quantityById[id] -= quantity;
  if (cart.quantityById[id] === 0) {
    delete cart.quantityById[id];
    cart.allIds = cart.allIds.filter(iteratedId => iteratedId !== id);
  }
};

const changeProductQuantity = (cart, id, quantity, configuration) => {
  if (quantity <= 0) return;
  if (configuration) {
    cart.quantityById[id] +=
      quantity - cart.configurationById[id][configuration];
    cart.configurationById[id] = {
      ...cart.configurationById[id],
      [configuration]: quantity
    };
  } else {
    cart.quantityById[id] = quantity;
  }
};

const calculateCountOfProducts = quantityById =>
  Object.values(quantityById).reduce(
    (totalCount, count) => totalCount + count,
    0
  );

const calculateTotalPrice = (products, quantityById) =>
  products.reduce((price, product) => {
    if (!product.fields || !product.fields.price) return price;
    return price + (product.fields.price || 0) * quantityById[product.sys.id];
  }, 0);

const getCartAdditionalFields = async () => {
  const setting = await settingsRepository.getSettingById(
    'cartAdditionalFields'
  );
  return setting.fields.configuration || [];
};

const processCartAdditionalFields = async body => {
  const additionalInformation = {};
  const additionalFields = await getCartAdditionalFields();
  additionalFields.forEach(({ name }) => {
    if (!body[name]) {
      throw createError(422, 'V objednávke chýbaju povinné údaje.');
    }
    additionalInformation[name] = body[name];
  });
  return additionalInformation;
};

module.exports = {
  addProduct,
  removeProduct,
  removeProductConfiguration,
  changeProductQuantity,
  calculateCountOfProducts,
  calculateTotalPrice,
  getCartAdditionalFields,
  processCartAdditionalFields
};
