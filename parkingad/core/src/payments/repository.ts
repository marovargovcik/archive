import { generateRandomId } from 'parkingad-helpers/generateRandomId';
import { redisRO, redisWO } from 'parkingad-helpers/redis';
import type { CreateTransactionResponse } from 'parkingad-helpers/types';

type PairPayment = {
  id: string;
  response: CreateTransactionResponse;
};

const createPayment = async () => {
  const id = generateRandomId();
  await redisWO.set(id, '');
  return id;
};

const pairPayment = async ({ id, response }: PairPayment) => {
  await redisWO.set(id, response.redirect);
};

const resolvePayment = async (id: string) => {
  const cache = await redisRO.get(id);
  if (!cache) {
    throw new Error('PAYMENT_ID_NOT_FOUND');
  }

  await redisWO.del(id);
};

export { createPayment, pairPayment, resolvePayment };
