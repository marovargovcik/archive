import supertest from 'supertest';

import app from '../../app';
import { deleteLibraryMember } from '../../members/repository';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';
import {
  placeAuthTokensIntoGlobalNamespace,
  tearDownConnections,
} from '../utils';

beforeAll(placeAuthTokensIntoGlobalNamespace);

describe('GET /members', () => {
  it('should return members', async () => {
    const response = await supertest(app)
      .get('/members')
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
  });
});

describe('GET /members/:ssn', () => {
  it('should return specific member', async () => {
    const response = await supertest(app)
      .get('/members/LXFEBFS1DIM')
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
  });

  it('should return 404 when trying to get not existing member', async () => {
    const response = await supertest(app)
      .get('/members/FSAFASasfSAKNFJNASFK')
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(404);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(404);
    expect(body.message).toEqual(
      'Member with ssn: FSAFASasfSAKNFJNASFK was not found.',
    );
    expect(body.errors).toHaveLength(0);
  });
});

describe('POST /members', () => {
  it('should insert new library member', async () => {
    const response = await supertest(app)
      .post('/members')
      .send({
        address1: 'TO_DELETE_RANDOM_ADDRESS_1',
        campus: 'TO_DELETE_CAMPUS_1',
        city: 'TO_DELETE_CITY_1',
        fname: 'TO_DELETE_FNAME_1',
        isProfessor: false,
        lname: 'TO_DELETE_LNAME_1',
        phoneNumber: 'TO_DELETE_PHONE_NUMBER_1',
        ssn: 'TO_DELETE_SSN_1',
        zipCode: 'TO_DELETE_ZIPCODE_1',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
  });

  it('should not insert member when payload is wrong', async () => {
    const response = await supertest(app)
      .post('/members')
      .send({
        wrongPayload: 'yes it is!',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(500);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(500);
  });
});

describe('DELETE /members/WHATISSSN', () => {
  it('should delete library member', async () => {
    await supertest(app)
      .post('/members')
      .send({
        address1: 'TO_DELETE_RANDOM_ADDRESS_2',
        campus: 'TO_DELETE_CAMPUS_2',
        city: 'TO_DELETE_CITY_2',
        fname: 'TO_DELETE_FNAME_2',
        isProfessor: false,
        lname: 'TO_DELETE_LNAME_2',
        phoneNumber: 'TO_DELETE_PHONE_NUMBER_2',
        ssn: 'TO_DELETE_SSN_2',
        zipCode: 'TO_DELETE_ZIPCODE_2',
      })
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      });

    const response = await supertest(app)
      .delete('/members/TO_DELETE_SSN_2')
      .set({
        Authorization: `Bearer ${global.CHIEF_LIBRARIAN_ACCESS_TOKEN}`,
      })
      .expect(200);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(200);
    expect(body.message).toEqual('Ok');
    expect(body.errors).toHaveLength(0);
  });
});

afterAll(async () => {
  await deleteLibraryMember('TO_DELETE_SSN_1');
  await tearDownConnections();
});
