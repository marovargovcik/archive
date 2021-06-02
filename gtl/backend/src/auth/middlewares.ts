import type { NextFunction, Response, Request } from 'express';
import createError from 'http-errors';

import { ROLES_HIERARCHY } from '../utils/rolesHierarchy';

import { verifyAccessToken } from './repository';

const ensureAuth = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!request.headers.authorization) {
    next(
      createError(401, 'No authorization header present in request.', {
        expose: true,
      }),
    );
    return;
  }

  try {
    const [, accessToken] = request.headers.authorization.split(' ');
    request.user = await verifyAccessToken(accessToken);
    next();
  } catch {
    next(
      createError(401, 'Access token is invalid.', {
        expose: true,
      }),
    );
  }
};

const ensureRole = (requiredRole: string) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const user = request.user;
  if (!ROLES_HIERARCHY[user.role].includes(requiredRole)) {
    next(
      createError(403, 'Not permitted to access this resource.', {
        expose: true,
      }),
    );
    return;
  }
  next();
};

export { ensureAuth, ensureRole };
