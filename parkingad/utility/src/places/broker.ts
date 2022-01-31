import { channel } from 'parkingad-helpers/rabbitmq';
import type { GetPlacesRequest } from 'parkingad-helpers/types';

import { getPlaces } from '@/places/repository';

const broker = async () => {
  await channel.assertQueue('getPlaces', {
    durable: false,
  });

  await channel.consume('getPlaces', async (message) => {
    if (!message) {
      return;
    }

    const request = message.content.toString() as GetPlacesRequest;
    const response = await getPlaces(request);

    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(JSON.stringify(response)),
      {
        correlationId: message.properties.correlationId,
      },
    );
    channel.ack(message);
  });
};

export { broker };
