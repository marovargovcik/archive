const path = require('path');
const fs = require('fs').promises;
const nanoid = require('nanoid');
const { sendGrid } = require('../clients');

const logErrorAndNotify = async error => {
  const filename = `${new Date().toISOString()}_${nanoid(8)}`;
  await fs.writeFile(path.resolve(`./logs/${filename}`), error);
  await sendGrid.send({
    to: process.env.WEBMASTER_EMAIL,
    from: process.env.FROM_EMAIL,
    templateId: process.env.SENDGRID_ERROR_NOTICE_TEMPLATE_ID,
    dynamic_template_data: {
      filename
    }
  });
};

module.exports = {
  logErrorAndNotify
};
