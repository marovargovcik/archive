import { Router } from 'express';
import type { Response, NextFunction } from 'express';

import { ensureAuth, ensureRole } from '../auth/middlewares';
import { createResponsePayload } from '../utils';
import { ROLES } from '../utils/rolesHierarchy';

import { lendLoan, returnLoan } from './repository';
import type {
  TBaseLoan,
  TPatchLoanRequest,
  TPostLoanRequest,
  TReturnLoanBody,
} from './types';

const router = Router();

router.post(
  '/loans',
  ensureAuth,
  ensureRole(ROLES.checkOutStaff),
  async (request: TPostLoanRequest, response: Response, next: NextFunction) => {
    try {
      await lendLoan(request.body);
      response.status(201).json(
        createResponsePayload<TBaseLoan>({
          payload: request.body,
          status: 201,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/loans',
  ensureAuth,
  ensureRole(ROLES.checkOutStaff),
  async (
    request: TPatchLoanRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      await returnLoan(request.body);
      response.json(
        createResponsePayload<TReturnLoanBody>({ payload: request.body }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
