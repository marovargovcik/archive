const { sendGrid } = require('../clients');

const sendEmail = async ({ name, email, subject, message }) => {
  await sendGrid.send({
    to: process.env.TO_EMAIL,
    from: email,
    templateId: process.env.SENDGRID_CONTACT_FORM_TEMPLATE_ID,
    dynamic_template_data: {
      name,
      email,
      subject,
      message
    }
  });
};

module.exports = {
  sendEmail
};
