import { Router } from 'express';
import type { Response, NextFunction } from 'express';

import { ensureAuth, ensureRole } from '../auth/middlewares';
import { createResponsePayload } from '../utils';
import { ROLES } from '../utils/rolesHierarchy';

import {
  getMembers,
  getMember,
  insertMember,
  deleteLibraryMember,
} from './repository';
import type {
  TMember,
  TGetMemberRequest,
  TGetMembersRequest,
  TPostMemberRequest,
  TDeleteRequest,
  TGetMembersResponsePayload,
} from './types';

const router = Router();

router.get(
  '/members',
  ensureAuth,
  ensureRole(ROLES.referenceLibrarian),
  async (
    request: TGetMembersRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { page } = request.query;
      const { data, pagination } = await getMembers({ page });
      response.json(
        createResponsePayload<TGetMembersResponsePayload>({
          payload: { data, pagination },
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/members/:ssn',
  ensureAuth,
  ensureRole(ROLES.referenceLibrarian),
  async (
    request: TGetMemberRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { ssn } = request.params;
      const data = await getMember(ssn);
      response.json(createResponsePayload({ payload: data }));
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/members',
  ensureAuth,
  ensureRole(ROLES.referenceLibrarian),
  async (
    request: TPostMemberRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      await insertMember(request.body);
      response.send(
        createResponsePayload<TMember>({ payload: request.body }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/members/:ssn',
  ensureAuth,
  ensureRole(ROLES.referenceLibrarian),
  async (request: TDeleteRequest, response: Response, next: NextFunction) => {
    try {
      const { ssn } = request.params;
      await deleteLibraryMember(ssn);
      response.send(createResponsePayload());
    } catch (error) {
      next(error);
    }
  },
);

export default router;
