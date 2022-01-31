import { channel } from 'parkingad-helpers/rabbitmq';

import { getSpots } from '@/spots/repository';

const broker = async () => {
  await channel.assertQueue('getSpots', {
    durable: false,
  });

  await channel.consume('getSpots', async (message) => {
    if (!message) {
      return;
    }

    const spots = await getSpots();
    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(JSON.stringify(spots)),
      {
        correlationId: message.properties.correlationId,
      },
    );
    channel.ack(message);
  });
};

export { broker };
