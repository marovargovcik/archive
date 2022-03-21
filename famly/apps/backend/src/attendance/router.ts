import { createError } from '@repo/helpers/api/createError';
import { createResponse } from '@repo/helpers/api/createResponse';
import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';

import {
  check,
  getAllCheckedIn,
  getAllCheckedInTodayForAtLeast2Hours,
  isCheckedIn,
} from '@/attendance/repository';
import type { TCheckRequest, TIsCheckedInRequest } from '@/attendance/types';
import type { TAttendanceWithChild } from '@/types/models';

const router = Router();

router.get(
  '/attendance/checked',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const results = await getAllCheckedIn();
      response.status(201).json(
        createResponse<TAttendanceWithChild[]>({
          errors: [],
          message: 'Ok.',
          payload: results,
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/attendance/checked/today/2',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const results = await getAllCheckedInTodayForAtLeast2Hours();
      response.status(201).json(
        createResponse<TAttendanceWithChild[]>({
          errors: [],
          message: 'Ok.',
          payload: results,
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/attendance/check/:childId',
  async (
    request: TIsCheckedInRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { childId } = request.params;

      let id;

      try {
        id = Number.parseInt(childId, 10);
      } catch {
        next(
          createError(400, 'INVALID_REQUEST', {
            errors: [
              {
                message: 'MUST_BE_NUMBER',
                source: 'childId',
              },
            ],
            expose: true,
          }),
        );
        return;
      }

      response.status(201).json(
        createResponse<boolean>({
          errors: [],
          message: 'Ok.',
          payload: await isCheckedIn({
            childId: id,
          }),
          status: 201,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/attendance/check',
  async (request: TCheckRequest, response: Response, next: NextFunction) => {
    try {
      const { childId } = request.body;

      if (!childId && typeof childId !== 'number') {
        next(
          createError(400, 'INVALID_REQUEST', {
            errors: [
              {
                message: 'MUST_BE_NUMBER',
                source: 'childId',
              },
            ],
            expose: true,
          }),
        );
      }

      await check({
        childId,
      });

      response.status(201).json(
        createResponse<null>({
          errors: [],
          message: 'Ok.',
          payload: null,
          status: 201,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export { router };
