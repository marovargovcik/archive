import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { createError } from 'parkingad-helpers/createError';
import { handleError } from 'parkingad-helpers/handleError';
import { initializeRabbitMQ } from 'parkingad-helpers/rabbitmq';
import { initializeRedis } from 'parkingad-helpers/redis';
import type { ExtendedHttpError } from 'parkingad-helpers/types';

import { router as advetisementsRouter } from '@/advertisements/routes';
import { router as paymentRouter } from '@/payments/routes';
import { router as spotsRouter } from '@/spots/routes';

void initializeRabbitMQ();
void initializeRedis();

const app = express();

app.use(
  cors({
    origin: process.env.PARKINGAD_WEBAPP_HOST as string,
  }),
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(advetisementsRouter);
app.use(paymentRouter);
app.use(spotsRouter);

app.use('*', (request: Request, response: Response, next: NextFunction) => {
  next(
    createError(404, 'Such endpoint does not exist.', {
      errors: [],
      expose: true,
    }),
  );
});

app.use(
  (
    error: Error | ExtendedHttpError,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    const json = handleError(error);
    response.status(json.status).json(json);
  },
);

export { app };
