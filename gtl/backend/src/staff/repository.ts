import createError from 'http-errors';

import database from '../utils/database';

import type { TStaffPerson } from './types';

const getStaffPersonBySsn = async (
  ssn: string,
  throwIfNotFound = true,
): Promise<TStaffPerson> => {
  const result = (await database('dbo.staff')
    .select('role', 'personSsn as ssn', 'passwordHash')
    .where({
      personSsn: ssn,
    })
    .first()) as TStaffPerson;
  if (!result && throwIfNotFound) {
    throw createError(404, `Staff person with ssn "${ssn}" does not exist.`, {
      expose: true,
    });
  }
  return result;
};

export { getStaffPersonBySsn };
