import supertest from 'supertest';

import app from '../../app';
import type { TGetBooksResponsePayload } from '../../books/types';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('GET /books', () => {
  it('should return books', async () => {
    const response = await supertest(app).get('/books').expect(200);
    const body = response.body as CreateJSONPayloadSignature<TGetBooksResponsePayload>;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
    expect(body.payload.pagination.currentPage).toEqual(1);
  });
});

afterAll(tearDownConnections);
