import fs from 'fs/promises';
import path from 'path';

import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { sign, verify } from 'jsonwebtoken';

import type { TStaffPersonWithoutPasswordHash } from '../staff/types';
import config from '../utils/config';

const generateToken = (type: 'accessToken' | 'refreshToken') => async (
  staffPerson: TStaffPersonWithoutPasswordHash,
): Promise<string> => {
  const privateKeyFilename =
    type === 'accessToken'
      ? config.security.accessTokenPrivateKeyFilename
      : config.security.refreshTokenPrivateKeyFilename;
  const expiresIn = type === 'accessToken' ? '5m' : '24h';
  const privateKey = await fs.readFile(
    path.resolve(`./security/${privateKeyFilename}`),
  );
  return await new Promise((resolve, reject) => {
    sign(
      staffPerson,
      privateKey,
      { algorithm: 'RS256', expiresIn },
      (error, token) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      },
    );
  });
};

const passwordAndPasswordHashMatches = async (
  password: string,
  passwordHash: string,
) => {
  const isMatch = await bcrypt.compare(password, passwordHash);
  if (!isMatch) {
    throw createError(401, 'Login failed.', {
      errors: [
        {
          message: 'Provided password is incorrect.',
          source: 'password',
        },
      ],
      expose: true,
    });
  }
};

const verifyToken = (type: 'accessToken' | 'refreshToken') => async (
  token: string,
): Promise<TStaffPersonWithoutPasswordHash> => {
  const publicKeyFilename =
    type === 'accessToken'
      ? config.security.accessTokenPublicKeyFilename
      : config.security.refreshTokenPublicKeyFilename;
  const publicKey = await fs.readFile(
    path.resolve(`./security/${publicKeyFilename}`),
  );
  return await new Promise((resolve, reject) => {
    verify(
      token,
      publicKey,
      {
        algorithms: ['RS256'],
      },
      (error, { role, ssn }: TStaffPersonWithoutPasswordHash) => {
        if (error) {
          reject(error);
        }
        resolve({ role, ssn });
      },
    );
  });
};

const generateAccessToken = generateToken('accessToken');
const generateRefreshToken = generateToken('refreshToken');
const verifyAccessToken = verifyToken('accessToken');
const verifyRefreshToken = verifyToken('refreshToken');

export {
  generateAccessToken,
  generateRefreshToken,
  passwordAndPasswordHashMatches,
  verifyAccessToken,
  verifyRefreshToken,
};
