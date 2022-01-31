import { channel } from 'parkingad-helpers/rabbitmq';
import type { CreateTransactionRequest } from 'parkingad-helpers/types';

import { createTransaction } from '@/transactions/repository';

const broker = async () => {
  await channel.assertQueue('createTransaction', {
    durable: false,
  });

  await channel.consume('createTransaction', async (message) => {
    if (!message) {
      return;
    }

    const request = JSON.parse(
      message.content.toString(),
    ) as CreateTransactionRequest;

    const response = await createTransaction(request);

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
