module.exports = async (req, res, next) => {
  req.session.captcha = req.session.captcha || {};
  next();
};
