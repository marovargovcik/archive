import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import type { ExtendedHttpError } from './utils/types';

import { authRouter } from '@/auth/routes';
import { createError } from '@/utils/createError';
import { handleError } from '@/utils/handleError';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

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
