import compression from 'compression';
import cors from 'cors';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import type { HttpError } from 'http-errors';

import authRoutes from './auth/routes';
import bookRoutes from './books/routes';
import internalRoutes from './internal/routes';
import loanRoutes from './loans/routes';
import membersRoutes from './members/routes';
import { handleError } from './utils';
import config from './utils/config';
import videoGamesRoutes from './videogames/routes';

const app = express();

app.set('port', config.port);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(internalRoutes);
app.use(membersRoutes);
app.use(bookRoutes);
app.use(loanRoutes);
app.use(videoGamesRoutes);

app.use('*', (request: Request, response: Response, next: NextFunction) => {
  next(createError(404, 'Page does not exist.', { expose: true }));
});

app.use(
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (
    error: Error | HttpError,
    request: Request,
    response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    const json = handleError(error);
    response.status(json.status).json(json);
  },
);

export default app;
