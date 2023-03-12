const createError = require('http-errors');
const svgCaptcha = require('svg-captcha');
const nanoid = require('nanoid');

const createCaptcha = storage => {
  const id = nanoid(32);
  const { data: svg, text } = svgCaptcha.create();
  storage[id] = text;
  return {
    id,
    svg
  };
};

const verifyCaptcha = ({ id, storage, text }) => {
  if (!storage[id]) {
    throw createError(400, 'Captcha not found.');
  }
  return storage[id] === text;
};

module.exports = {
  createCaptcha,
  verifyCaptcha
};
