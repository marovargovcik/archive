import knex from 'knex';
import { attachPaginate } from 'knex-paginate';

import config from './config';

attachPaginate();

const database = knex({
  client: 'mssql',
  connection: {
    database: config.database.name,
    host: config.database.server,
    password: config.database.password,
    user: config.database.user,
  },
});

export default database;
