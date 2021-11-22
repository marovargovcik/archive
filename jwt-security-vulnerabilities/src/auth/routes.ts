import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  generateBase64EncodedHeaderWithAlgNone,
  generateToken,
  generateTokenFromPublicKey,
  verifyToken,
  verifyTokenWithJws2,
} from '@/auth/repository';
import type { KeyResponsePayload, LoginResponsePayload } from '@/auth/types';
import { createError } from '@/utils/createError';
import { createResponse } from '@/utils/createResponse';

const router = Router();

router.get(
  '/auth/key',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const publicKey = await fs.readFile(
        path.resolve('./security/publicKey.pem'),
      );

      response.send(
        createResponse<KeyResponsePayload>({
          errors: [],
          message: 'Ok',
          payload: {
            publicKey: publicKey.toString(),
          },
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/auth/login',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const accessToken = await generateToken();
      response.send(
        createResponse<LoginResponsePayload>({
          errors: [],
          message: 'Ok',
          payload: { accessToken },
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/auth/verify/safe',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.headers.authorization) {
        next(
          createError(401, 'No authorization header present in the request.', {
            errors: [],
            expose: true,
          }),
        );
        return;
      }

      try {
        const [, accessToken] = request.headers.authorization.split(' ');
        await verifyToken(accessToken);
      } catch {
        next(
          createError(401, 'Invalid or expired access token.', {
            errors: [],
            expose: true,
          }),
        );
        return;
      }

      response.send(
        createResponse({
          errors: [],
          message: 'Ok',
          payload: undefined,
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/auth/verify/unsafe',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.headers.authorization) {
        next(
          createError(401, 'No authorization header present in the request.', {
            errors: [],
            expose: true,
          }),
        );
        return;
      }

      try {
        const [, accessToken] = request.headers.authorization.split(' ');
        await verifyTokenWithJws2(accessToken);
      } catch {
        next(
          createError(401, 'Invalid or expired access token.', {
            errors: [],
            expose: true,
          }),
        );
        return;
      }

      response.send(
        createResponse({
          errors: [],
          message: 'Ok',
          payload: undefined,
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/auth/hacker/tokenFromPublicKey',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const accessToken = await generateTokenFromPublicKey();

      response.send(
        createResponse<LoginResponsePayload>({
          errors: [],
          message: 'Ok',
          payload: { accessToken },
          status: 200,
        }),
      );
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/auth/hacker/base64EncodedHeaderWithAlgNone',
  (request: Request, response: Response) => {
    const base64EncodedHeader = generateBase64EncodedHeaderWithAlgNone();
    response.send(
      createResponse<string>({
        errors: [],
        message: 'Ok',
        payload: base64EncodedHeader,
        status: 200,
      }),
    );
  },
);

export { router as authRouter };
