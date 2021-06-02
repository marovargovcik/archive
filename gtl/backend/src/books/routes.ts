import { Router } from 'express';
import type { Response, NextFunction } from 'express';

import { ensureAuth, ensureRole } from '../auth/middlewares';
import { createResponsePayload } from '../utils';

import { getBookAvailability, getBooks } from './repository';
import type {
  TGetBookAvailabilityRequest,
  TGetBookAvailabilityResponsePayload,
  TGetBooksRequest,
  TGetBooksResponsePayload,
} from './types';

const router = Router();

router.get(
  '/books',
  async (request: TGetBooksRequest, response: Response, next: NextFunction) => {
    try {
      const { page, ...filters } = request.query;
      const { data, pagination } = await getBooks({ page }, filters);
      response.json(
        createResponsePayload<TGetBooksResponsePayload>({
          payload: { data, pagination },
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/books/:isbn/availability',
  ensureAuth,
  ensureRole('check-out staff'),
  async (
    request: TGetBookAvailabilityRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { isbn } = request.params;
      const payload = await getBookAvailability(isbn);
      response.json(
        createResponsePayload<TGetBookAvailabilityResponsePayload>({ payload }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
