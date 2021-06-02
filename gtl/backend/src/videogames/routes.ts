import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

import { ensureAuth, ensureRole } from '../auth/middlewares';
import { createResponsePayload } from '../utils';

import { getVideosGameAvailability, getVideosGames } from './repository';
import type {
  TGetVideoGameAvailabilityRequest,
  TGetVideoGameAvailabilityResponsePayload,
  TGetVideoGamesResponsePayload,
} from './types';

const router = Router();

router.get(
  '/video-games',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const payload = await getVideosGames();
      response.json(
        createResponsePayload<TGetVideoGamesResponsePayload>({
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/video-games/:_id/availability',
  ensureAuth,
  ensureRole('check-out staff'),
  async (
    request: TGetVideoGameAvailabilityRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { _id } = request.params;
      const payload = await getVideosGameAvailability(_id);
      response.json(
        createResponsePayload<TGetVideoGameAvailabilityResponsePayload>({
          payload,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
