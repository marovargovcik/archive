const { sendGridClient } = require('../clients');

const saveSubscriber = async email => {
  const request = {
    body: {
      list_ids: ['b614f4b5-e9fa-4aad-a5f8-2e1ded5bc519'],
      contacts: [
        {
          email
        }
      ]
    },
    method: 'PUT',
    url: '/v3/marketing/contacts'
  };
  await sendGridClient.request(request);
};

module.exports = {
  saveSubscriber
};
