import supertest from 'supertest';

import app from '../app';
import { config, database, redis } from '../utils';

const placeAuthTokensIntoGlobalNamespace = async () => {
  let response = await supertest(app)
    .post('/auth/login')
    .send({
      password: config.test.chiefLibrarianPassword,
      ssn: config.test.chiefLibrarianSsn,
    })
    .expect(200);

  global.CHIEF_LIBRARIAN_ACCESS_TOKEN = response.body.payload.accessToken;
  global.CHIEF_LIBRARIAN_REFRESH_TOKEN = response.body.payload.refreshToken;

  response = await supertest(app)
    .post('/auth/login')
    .send({
      password: config.test.checkOutStaffPassword,
      ssn: config.test.checkOutStaffSsn,
    })
    .expect(200);

  global.CHECK_OUT_STAFF_ACCESS_TOKEN = response.body.payload.accessToken;
  global.CHECK_OUT_STAFF_REFRESH_TOKEN = response.body.payload.refreshToken;
};

const tearDownConnections = async () => {
  redis.client.quit();
  await database.destroy();
};

export { placeAuthTokensIntoGlobalNamespace, tearDownConnections };
