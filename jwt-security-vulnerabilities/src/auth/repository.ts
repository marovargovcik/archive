import type { Header } from 'jws';
import jws from 'jws';
import jws2 from 'jws2';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { User } from '@/utils/types';

const user: User = {
  password: 'password',
  username: 'admin',
};

const generateBase64EncodedHeaderWithAlgNone = () => {
  const header: Header = {
    alg: 'none',
  };

  return Buffer.from(JSON.stringify(header)).toString('base64');
};

const generateToken = async (): Promise<string> => {
  const privateKey = await fs.readFile(
    path.resolve('./security/privateKey.pem'),
  );

  const header: Header = {
    alg: 'RS256',
  };

  const payload = user;

  return jws.sign({
    header,
    payload,
    secret: privateKey,
  });
};

const generateTokenFromPublicKey = async (): Promise<string> => {
  const publicKey = await fs.readFile(path.resolve('./security/publicKey.pem'));

  const header: Header = {
    alg: 'HS256',
  };

  const payload = user;

  return jws.sign({
    header,
    payload,
    secret: publicKey,
  });
};

const verifyToken = async (token: string): Promise<boolean> => {
  const publicKey = await fs.readFile(path.resolve('./security/publicKey.pem'));
  const isValid = jws.verify(token, 'RS256', publicKey);
  if (!isValid) {
    throw new Error('INVALID_TOKEN');
  }

  return isValid;
};

const verifyTokenWithJws2 = async (token: string): Promise<boolean> => {
  const publicKey = await fs.readFile(path.resolve('./security/publicKey.pem'));
  // @ts-expect-error old version, type missmatch
  const isValid = jws2.verify(token, publicKey);
  if (!isValid) {
    throw new Error('INVALID_TOKEN');
  }

  return isValid;
};

export {
  generateBase64EncodedHeaderWithAlgNone,
  generateToken,
  generateTokenFromPublicKey,
  verifyToken,
  verifyTokenWithJws2,
};
