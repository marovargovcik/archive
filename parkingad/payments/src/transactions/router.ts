import type { Request, Response } from 'express';
import { Router } from 'express';

import {
  completeTransaction,
  getTransactionById,
  prepareTemplate,
  sendTransactionReceipt,
} from '@/transactions/repository';

const router = Router();

router.get(
  '/transactions/:id/payment',
  async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const transaction = await getTransactionById(id);
      if (transaction.completed) {
        response.status(200).send('Already paid');
        return;
      }

      const template = await prepareTemplate(transaction);
      response.send(template);
    } catch {
      response.status(404).send('Not found');
    }
  },
);

router.post(
  '/transactions/:id/payment',
  async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const redirect = await completeTransaction(id);
      await sendTransactionReceipt(id);
      response.redirect(redirect);
    } catch {
      response.status(404).send('Not found');
    }
  },
);

export { router };
