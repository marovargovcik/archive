import supertest from 'supertest';

import app from '../../app';
import type { TRefreshTokenResponsePayload } from '../../auth/types';
import { redis } from '../../utils';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('POST /auth/login', () => {
  it('should reject when wrong password entered', async () => {
    const response = await supertest(app)
      .post('/auth/login')
      .send({
        password: 'badpassword',
        ssn: 'AQJOAQD1',
      })
      .expect(401);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(401);
    expect(body.message).toEqual('Login failed.');
    expect(body.errors).toHaveLength(1);
    expect(body.errors[0].message).toEqual('Provided password is incorrect.');
    expect(body.errors[0].source).toEqual('password');
  });
});

describe('POST /auth/token', () => {
  it('should return new access token', async () => {
    const response = await supertest(app)
      .post('/auth/token')
      .send({
        refreshToken: global.CHIEF_LIBRARIAN_REFRESH_TOKEN,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature<TRefreshTokenResponsePayload>;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
    expect(typeof body.payload.accessToken).toEqual('string');
  });

  it('should reject when refresh token was manipulated', async () => {
    const response = await supertest(app)
      .post('/auth/token')
      .send({
        refreshToken: global.CHIEF_LIBRARIAN_REFRESH_TOKEN + 'manipulated',
      })
      .expect(401);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(401);
    expect(body.message).toEqual('Provided token is invalid.');
    expect(body.errors).toHaveLength(0);
  });

  it('should reject when refresh token not in redis (blacklisted)', async () => {
    await redis.del(global.CHIEF_LIBRARIAN_REFRESH_TOKEN);
    const response = await supertest(app)
      .post('/auth/token')
      .send({
        refreshToken: global.CHIEF_LIBRARIAN_REFRESH_TOKEN,
      })
      .expect(401);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(401);
    expect(body.message).toEqual(
      'Refresh token is either expired, invalid or does not match with the user.',
    );
    expect(body.errors).toHaveLength(0);
  });
});

afterAll(tearDownConnections);
