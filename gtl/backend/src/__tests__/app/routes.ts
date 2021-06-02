import supertest from 'supertest';

import app from '../../app';
import type { CreateJSONPayloadSignature } from '../../utils/createResponsePayload';

describe('GET /not-existing-route', () => {
  it('should return 404 as page does not exist', async () => {
    const response = await supertest(app)
      .get('/not-existing-route')
      .expect(404);
    const body = response.body as CreateJSONPayloadSignature;
    expect(body.status).toEqual(404);
    expect(body.message).toEqual('Page does not exist.');
    expect(body.errors).toHaveLength(0);
  });
});
