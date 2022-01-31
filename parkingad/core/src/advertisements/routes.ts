import type { Request, Response } from 'express';
import { Router } from 'express';
import { createResponse } from 'parkingad-helpers/createResponse';
import { channel } from 'parkingad-helpers/rabbitmq';

const router = Router();

router.get('/advertisement', async (request: Request, response: Response) => {
  try {
    const queue = await channel.assertQueue('', { exclusive: true });
    const correlationId = Math.random().toString();
    await channel.consume(
      queue.queue,
      (message) => {
        if (!message || message.properties.correlationId !== correlationId) {
          return;
        }

        const advertisement = message.content.toString();

        response.send(
          createResponse<string>({
            errors: [],
            message: 'Ok.',
            payload: advertisement,
            status: 200,
          }),
        );
      },
      {
        noAck: true,
      },
    );
    channel.sendToQueue('getAdvertisement', Buffer.from(''), {
      correlationId,
      replyTo: queue.queue,
    });
  } catch {
    response.send(
      createResponse<null>({
        errors: [],
        message: 'Ad service failed to respond.',
        payload: null,
        status: 500,
      }),
    );
  }
});

export { router };
