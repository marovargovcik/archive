import { channel } from 'parkingad-helpers/rabbitmq';

import { getAdvertisement } from '@/advertisements/repository';

const broker = async () => {
  await channel.assertQueue('getAdvertisement', {
    durable: false,
  });

  await channel.consume('getAdvertisement', async (message) => {
    if (!message) {
      return;
    }

    const advertisement = await getAdvertisement();
    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(advertisement),
      {
        correlationId: message.properties.correlationId,
      },
    );
    channel.ack(message);
  });
};

export { broker };
