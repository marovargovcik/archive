import supertest from 'supertest';

import app from '../../app';
import { ensureRole } from '../../auth/middlewares';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('auth middlewares', () => {
  it('should reject without authorization header in the request', async () => {
    const response = await supertest(app).get('/members').expect(401);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(401);
    expect(body.errors).toHaveLength(0);
    expect(body.message).toEqual('No authorization header present in request.');
  });

  it('should reject when access token is manipulated', async () => {
    const response = await supertest(app)
      .get('/members')
      .set({
        Authorization: `Bearer ${global.CHECK_OUT_STAFF_ACCESS_TOKEN}manipulated`,
      })
      .expect(401);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(401);
    expect(body.errors).toHaveLength(0);
    expect(body.message).toEqual('Access token is invalid.');
  });

  it('should reject when trying to access endpoint protected with role upper in hierarchy', async () => {
    const response = await supertest(app)
      .get('/members')
      .set({
        Authorization: `Bearer ${global.CHECK_OUT_STAFF_ACCESS_TOKEN}`,
      })
      .expect(403);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(403);
    expect(body.errors).toHaveLength(0);
    expect(body.message).toEqual('Not permitted to access this resource.');
  });

  it('should call next() after ensureRole middleware passes', async () => {
    const request = {
      user: {
        role: 'chief librarian',
      },
    };
    const response = {};
    const next = jest.fn();
    const middleware = ensureRole('chief librarian');
    // @ts-expect-error mocking functions to test next call
    middleware(request, response, next);
    expect(next).toHaveBeenCalled();
  });
});

afterAll(tearDownConnections);
