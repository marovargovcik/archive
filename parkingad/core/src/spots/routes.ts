import type { Request, Response } from 'express';
import { Router } from 'express';
import { createResponse } from 'parkingad-helpers/createResponse';
import { channel } from 'parkingad-helpers/rabbitmq';
import type { Place, Spot } from 'parkingad-helpers/types';

const router = Router();

router.get('/spots', async (request: Request, response: Response) => {
  try {
    const queue = await channel.assertQueue('', { exclusive: true });
    const correlationId = Math.random().toString();
    await channel.consume(
      queue.queue,
      (message) => {
        if (!message || message.properties.correlationId !== correlationId) {
          return;
        }

        const spots = JSON.parse(message.content.toString()) as Spot[];

        response.send(
          createResponse<Spot[]>({
            errors: [],
            message: 'Ok.',
            payload: spots,
            status: 200,
          }),
        );
      },
      {
        noAck: true,
      },
    );
    channel.sendToQueue('getSpots', Buffer.from(''), {
      correlationId,
      replyTo: queue.queue,
    });
  } catch {
    response.send(
      createResponse<null>({
        errors: [],
        message: 'Spots service failed to respond.',
        payload: null,
        status: 500,
      }),
    );
  }
});

router.get(
  '/spots/:name/places',
  async (request: Request, response: Response) => {
    try {
      const { name } = request.params as { name: Spot['name'] };
      const queue = await channel.assertQueue('', { exclusive: true });
      const correlationId = Math.random().toString();
      await channel.consume(
        queue.queue,
        (message) => {
          if (!message || message.properties.correlationId !== correlationId) {
            return;
          }

          const places = JSON.parse(message.content.toString()) as Place[];

          response.send(
            createResponse<Place[]>({
              errors: [],
              message: 'Ok.',
              payload: places,
              status: 200,
            }),
          );
        },
        {
          noAck: true,
        },
      );

      channel.sendToQueue('getPlaces', Buffer.from(name), {
        correlationId,
        replyTo: queue.queue,
      });
    } catch {
      response.send(
        createResponse<null>({
          errors: [],
          message: 'Places service failed to respond.',
          payload: null,
          status: 500,
        }),
      );
    }
  },
);

export { router };
