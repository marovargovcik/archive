import supertest from 'supertest';

import app from '../../app';
import { deleteLoan } from '../../loans/repository';
import type { TBaseLoan, TReturnLoanBody } from '../../loans/types';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('POST /loans', () => {
  it('should insert a new loan', async () => {
    const response = await supertest(app)
      .post('/loans')
      .send({
        copyId: 947,
        memberId: '0003038d-7dab-41eb-b444-392fd56ef82e',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(201);
    await deleteLoan({
      borrowDate: new Date().toLocaleDateString('fr-CA'),
      copyId: 947,
      memberId: '0003038d-7dab-41eb-b444-392fd56ef82e',
    });
    const body = response.body as CreateJSONPayloadSignature<TBaseLoan>;
    expect(body.status).toEqual(201);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
    expect(body.payload.copyId).toEqual(947);
    expect(body.payload.memberId).toEqual(
      '0003038d-7dab-41eb-b444-392fd56ef82e',
    );
  });
});

describe('PATCH /loans', () => {
  it('should return existing loan and update condition', async () => {
    await supertest(app)
      .post('/loans')
      .send({
        copyId: 947,
        memberId: '0003038d-7dab-41eb-b444-392fd56ef82e',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      });
    const response = await supertest(app)
      .patch('/loans')
      .send({
        borrowDate: new Date().toLocaleDateString('fr-CA'),
        condition: 'damaged',
        copyId: 947,
        memberId: '0003038d-7dab-41eb-b444-392fd56ef82e',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature<TReturnLoanBody>;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
    expect(body.payload.condition).toEqual('damaged');

    await deleteLoan({
      borrowDate: new Date().toLocaleDateString('fr-CA'),
      copyId: 947,
      memberId: '0003038d-7dab-41eb-b444-392fd56ef82e',
    });
  });
});

afterAll(tearDownConnections);
