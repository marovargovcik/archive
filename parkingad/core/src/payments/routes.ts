import type { Request, Response } from 'express';
import { Router } from 'express';
import { channel } from 'parkingad-helpers/rabbitmq';
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
} from 'parkingad-helpers/types';

import {
  createPayment,
  pairPayment,
  resolvePayment,
} from '@/payments/repository';

const router = Router();

type PostPaymentRequestPayload = Pick<
  CreateTransactionRequest['transaction'],
  'email' | 'firstName' | 'item' | 'lastName'
>;

router.post('/payments', async (request: Request, response: Response) => {
  try {
    const { email, firstName, lastName, item } =
      request.body as PostPaymentRequestPayload;
    const paymentId = await createPayment();
    console.log(paymentId);
    const createTransactionRequest: CreateTransactionRequest = {
      callbacks: {
        cancel: `${process.env.PARKINGAD_CORE_HOST}/payments/callback/${paymentId}?state=cancel`,
        success: `${process.env.PARKINGAD_CORE_HOST}/payments/callback/${paymentId}?state=success`,
      },
      transaction: {
        amount: 70,
        currency: 'DKK',
        email,
        firstName,
        item,
        lastName,
      },
    };
    const queue = await channel.assertQueue('', { exclusive: true });
    const correlationId = Math.random().toString();
    await channel.consume(
      queue.queue,
      async (message) => {
        if (!message || message.properties.correlationId !== correlationId) {
          return;
        }

        const createTransactionResponse = JSON.parse(
          message.content.toString(),
        ) as CreateTransactionResponse;

        await pairPayment({
          id: paymentId,
          response: createTransactionResponse,
        });
        response.redirect(createTransactionResponse.redirect);
      },
      {
        noAck: true,
      },
    );
    channel.sendToQueue(
      'createTransaction',
      Buffer.from(JSON.stringify(createTransactionRequest)),
      {
        correlationId,
        replyTo: queue.queue,
      },
    );
  } catch {
    response.send('ERROR');
  }
});

router.get(
  '/payments/callback/:id',
  async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { state } = request.query as { state: 'cancel' | 'success' };

      await resolvePayment(id);
      if (state === 'cancel') {
        response.redirect('http://localhost:3006/payment/ups');
        return;
      }

      response.redirect('http://localhost:3006/payment/thank-you');
    } catch {
      response.send('ERROR');
    }
  },
);

router.get('/payments/demo', (request, response) => {
  response.send(
    `<form action="http://localhost:3000/payments" method="POST">
      <input name="firstName" required="" type="text" />
      <input name="lastName" required="" type="text" />
      <input name="email" required="" type="text" />
      <input name="item" required="" type="text" />
      <button type="submit">Submit</button>
    </form>`,
  );
});

export { router };
