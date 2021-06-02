import type { NextFunction, Response } from 'express';
import { Router } from 'express';
import createError from 'http-errors';

import { getStaffPersonBySsn } from '../staff/repository';
import { createResponsePayload, redis } from '../utils';

import {
  generateAccessToken,
  generateRefreshToken,
  passwordAndPasswordHashMatches,
  verifyRefreshToken,
} from './repository';
import type {
  TLoginRequest,
  TLoginResponsePayload,
  TRefreshTokenRequest,
  TRefreshTokenResponsePayload,
} from './types';

const router = Router();

router.post(
  '/auth/login',
  async (request: TLoginRequest, response: Response, next: NextFunction) => {
    try {
      const { password, ssn } = request.body;

      let staffPerson;
      let passwordHash;
      try {
        const { passwordHash: hash, ...rest } = await getStaffPersonBySsn(ssn);
        staffPerson = rest;
        passwordHash = hash;
      } catch (error) {
        next(
          createError(401, 'Login failed.', {
            errors: [
              {
                message: error.message,
                source: 'ssn',
              },
            ],
            expose: true,
          }),
        );
      }

      try {
        await passwordAndPasswordHashMatches(password, passwordHash.toString());
      } catch (error) {
        next(error);
        return;
      }

      const accessToken = await generateAccessToken(staffPerson);
      const refreshToken = await generateRefreshToken(staffPerson);
      await redis.set(refreshToken, ssn);
      response.send(
        createResponsePayload<TLoginResponsePayload>({
          payload: { accessToken, refreshToken },
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/auth/token',
  async (
    request: TRefreshTokenRequest,
    response: Response,
    next: NextFunction,
  ) => {
    try {
      const { refreshToken } = request.body;

      let staffPerson;
      try {
        staffPerson = await verifyRefreshToken(refreshToken);
      } catch {
        next(createError(401, 'Provided token is invalid.', { expose: true }));
        return;
      }

      const associatedSsn = await redis.get(refreshToken);
      if (staffPerson.ssn !== associatedSsn) {
        next(
          createError(
            401,
            'Refresh token is either expired, invalid or does not match with the user.',
            { expose: true },
          ),
        );
        return;
      }

      const accessToken = await generateAccessToken(staffPerson);
      response.send(
        createResponsePayload<TRefreshTokenResponsePayload>({
          payload: { accessToken },
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

export default router;
