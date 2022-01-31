// eslint-disable-next-line import/order
import dotenv from 'dotenv';

dotenv.config();

/* eslint-disable import/first */
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { createError } from 'parkingad-helpers/createError';
import { handleError } from 'parkingad-helpers/handleError';
import { initializeRabbitMQ } from 'parkingad-helpers/rabbitmq';
import { initializeRedis } from 'parkingad-helpers/redis';
import type { ExtendedHttpError } from 'parkingad-helpers/types';

import { broker as advertisementsBroker } from '@/advertisements/broker';
import { broker as placesBroker } from '@/places/broker';
import { broker as spotsBroker } from '@/spots/broker';
/* eslint-enable import/first */

void initializeRabbitMQ(advertisementsBroker, placesBroker, spotsBroker);
void initializeRedis();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
