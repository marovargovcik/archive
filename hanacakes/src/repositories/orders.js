const bcrypt = require('bcrypt');
const createError = require('http-errors');
const isEmpty = require('lodash/isEmpty');
const {
  contentful,
  contentfulManagement,
  imgur,
  sendGrid
} = require('../clients');

const getOrder = async id => {
  const query = {
    content_type: 'orders',
    'fields.id': id
  };
  const orders = await contentful.getEntries(query);
  if (isEmpty(orders.items) || orders.items[0].fields.id !== id) {
    throw createError(404, 'Objednávka nebola nájdená.');
  }
  return orders.items[0];
};

const uploadAttachment = async ({ id, files }) => {
  const albumResponse = await imgur({
    method: 'post',
    url: '/album',
    data: {
      title: `Objednávka ${id}`
    }
  });
  const {
    data: { id: albumId, deletehash: albumHash },
    success: albumCreated
  } = albumResponse.data;
  const responses = await Promise.all(
    files.map(file =>
      imgur({
        method: 'post',
        url: '/image',
        data: {
          image: file.buffer.toString('base64'),
          album: albumHash
        }
      })
    )
  );
  if (!albumCreated && !responses.some(response => response.data.success)) {
    throw createError(
      400,
      'Pri nahrávaní prílohy nastala neočakávaná chyba. Kontaktujte prevadzkovateľa webovej stránky.'
    );
  }
  return `https://imgur.com/a/${albumId}`;
};

const saveOrder = async ({
  id,
  additionalInformation,
  attachments,
  firstName,
  lastName,
  phoneNumber,
  email,
  pickupDate,
  price,
  items,
  note,
  coupon,
  encryptedPinCode
}) => {
  const space = await contentfulManagement.getSpace(
    process.env.CONTENTFUL_SPACE_ID
  );
  const environment = await space.getEnvironment('master');
  const entry = await environment.createEntry('orders', {
    fields: {
      id: {
        'en-US': id.toString()
      },
      additionalInformation: {
        'en-US': additionalInformation
      },
      attachments: {
        'en-US': attachments
      },
      status: {
        'en-US': 'Čaká na spracovanie'
      },
      firstName: {
        'en-US': firstName
      },
      lastName: {
        'en-US': lastName
      },
      email: {
        'en-US': email
      },
      phoneNumber: {
        'en-US': phoneNumber
      },
      price: {
        'en-US': price
      },
      pickupDate: {
        'en-US': pickupDate
      },
      items: {
        'en-US': items
      },
      note: {
        'en-US': note
      },
      encryptedPinCode: {
        'en-US': encryptedPinCode
      },
      ...(coupon && {
        coupon: {
          'en-US': coupon
        }
      })
    }
  });
  await entry.publish();
};

const changeOrderStatus = async (entryId, status) => {
  const space = await contentfulManagement.getSpace(
    process.env.CONTENTFUL_SPACE_ID
  );
  const environment = await space.getEnvironment('master');
  const entry = await environment.getEntry(entryId);
  entry.fields.status = {
    'en-US': status
  };
  const updatedEntry = await entry.update();
  await updatedEntry.publish();
};

const getNextOrderId = async () => {
  const query = {
    content_type: 'orders',
    select: 'fields.id',
    order: '-sys.createdAt',
    limit: 1
  };
  const orders = await contentful.getEntries(query);
  if (isEmpty(orders.items)) {
    return 1;
  }
  return parseInt(orders.items[0].fields.id, 10) + 1;
};

const sendConfirmationEmail = async (id, pinCode, recipient) => {
  await sendGrid.send({
    to: recipient,
    from: process.env.FROM_EMAIL,
    templateId: process.env.SENDGRID_CUSTOMER_ORDER_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      id,
      pinCode
    }
  });
};

const sendNoticeEmail = async id => {
  await sendGrid.send({
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL,
    templateId: process.env.SENDGRID_ORDER_NOTICE_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      id,
      masterPinCode: process.env.MASTER_PIN_CODE
    }
  });
};

const sendStatusChangeEmail = async ({ id, recipient, status, message }) => {
  await sendGrid.send({
    to: recipient,
    from: process.env.FROM_EMAIL,
    templateId: process.env.SENDGRID_CUSTOMER_ORDER_STATUS_CHANGE_TEMPLATE_ID,
    dynamic_template_data: {
      id,
      recipient,
      message,
      status: status.toLowerCase()
    }
  });
};

const generatePinCode = () =>
  (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

const encryptPinCode = async pinCode => bcrypt.hash(pinCode, 10);

const comparePinCode = async (pinCode, encryptedPinCode) => {
  const match = await bcrypt.compare(pinCode, encryptedPinCode);
  const masterMatch = await bcrypt.compare(
    pinCode,
    process.env.MASTER_PIN_CODE_HASH
  );
  if (!match && !masterMatch) {
    throw createError(401, 'Nesprávny pin kód.');
  }
  return masterMatch ? 'MASTER' : 'REGULAR';
};

module.exports = {
  getOrder,
  uploadAttachment,
  saveOrder,
  changeOrderStatus,
  getNextOrderId,
  sendNoticeEmail,
  sendConfirmationEmail,
  sendStatusChangeEmail,
  generatePinCode,
  encryptPinCode,
  comparePinCode
};
