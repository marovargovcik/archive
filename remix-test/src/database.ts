import path from 'node:path';

import Database from 'better-sqlite3';

const DB_PATH = path.resolve(__dirname, '../database/database.db');

const database = new Database(DB_PATH, {
  fileMustExist: true,
});

database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');

export { database };
