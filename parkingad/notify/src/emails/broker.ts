import { channel } from 'parkingad-helpers/rabbitmq';
import type { SendEmailRequest } from 'parkingad-helpers/types';

import { sendEmail } from '@/emails/repository';

const broker = async () => {
  await channel.assertExchange('sendEmail', 'direct', {
    durable: false,
  });
  const queue = await channel.assertQueue('', {
    exclusive: true,
  });

  await channel.bindQueue(queue.queue, 'sendEmail', '');
  await channel.consume(
    queue.queue,
    async (message) => {
      if (!message) {
        return;
      }

      const request = JSON.parse(
        message.content.toString(),
      ) as SendEmailRequest;

      try {
        await sendEmail(request);
        // eslint-disable-next-line no-console
        console.log('email sent');
      } catch {
        // log error
      }
    },
    {
      noAck: true,
    },
  );
};

export { broker };
