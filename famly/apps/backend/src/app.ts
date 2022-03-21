import { createError } from '@repo/helpers/api/createError';
import { handleError } from '@repo/helpers/api/handleError';
import type { ExtendedHttpError } from '@repo/types/api/errors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

import { router as attendanceRouter } from '@/attendance/router';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(attendanceRouter);

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
