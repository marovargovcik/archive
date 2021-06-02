import supertest from 'supertest';

import app from '../../app';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('GET /internal', () => {
  it('should return payload as it was sent', async () => {
    const response = await supertest(app).post('/internal/send-notices').send({ number: 5 }).expect(200);
    const body = response.body as CreateJSONPayloadSignature<{ number: number }>;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
    expect(body.payload.number).toEqual(5);
  });
});

afterAll(tearDownConnections);
