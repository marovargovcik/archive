import createError from 'http-errors';

import database from '../utils/database';
import type { TPersonAddress } from '../utils/types';

import type {
  TGetMembersPagination,
  TMember,
  TMembersNormalized,
  TMemberWithAddressesAndPhoneNumbers,
} from './types';

const getMembers = async (pagination: TGetMembersPagination) => {
  const queryResult = await database('members')
    .select(
      'members.id as memberId',
      'members.campus',
      'members.isProfessor',
      'personAddresses.address1',
      'personAddresses.address2',
      'personAddresses.address3',
      'personAddresses.city',
      'personAddresses.zipCode',
      'people.ssn',
      'people.fname',
      'people.lname',
      'personPhoneNumbers.phoneNumber',
    )
    .leftJoin(
      'personAddresses',
      'members.personSsn',
      'personAddresses.personSsn',
    )
    .leftJoin('people', 'people.ssn', 'members.personSsn')
    .leftJoin(
      'personPhoneNumbers',
      'personPhoneNumbers.personSsn',
      'members.personSsn',
    )
    .orderBy('people.ssn', 'asc')
    .paginate<TMember[]>({
      currentPage: Number.parseInt(pagination.page, 10) || 1,
      perPage: 50,
    });

  const members = queryResult.data.reduce(
    (
      members: TMembersNormalized,
      {
        address1,
        address2,
        address3,
        zipCode,
        city,
        phoneNumber,
        ...member
      }: TMember,
    ) => {
      const entry = members[member.ssn] || {
        ...member,
        addresses: [] as TPersonAddress[],
        phoneNumbers: [] as string[],
      };
      entry.addresses.push({ address1, address2, address3, city, zipCode });
      entry.phoneNumbers.push(phoneNumber);
      members[member.ssn] = entry;
      return members;
    },
    {},
  );

  const membersValues: TMemberWithAddressesAndPhoneNumbers[] = Object.values(
    members,
  );

  return { data: membersValues, pagination: queryResult.pagination };
};

const getMember = async (ssn: string, throwIfNotFound = true) => {
  const result = await database('members')
    .select('*')
    .where({
      personSsn: ssn,
    })
    .first();
  if (throwIfNotFound && !result) {
    throw createError(404, `Member with ssn: ${ssn} was not found.`, {
      expose: true,
    });
  }
  return result[0];
};

const insertMember = async (member: TMember) => {
  const {
    address1,
    address2,
    address3,
    campus,
    city,
    fname,
    isProfessor,
    lname,
    phoneNumber,
    ssn,
    zipCode,
  } = member;

  await database.raw<TMember>(
    `exec dbo.insertLibraryMember @ssn = '${ssn}', @fname = '${fname}', @lname = '${lname}', @campus = '${campus}', @isProfessor = ${isProfessor}, @address1 = '${address1}', @address2 = '${address2}', @address3 = '${address3}', @city = '${city}', @zipCode = '${zipCode}', @phoneNumber = '${phoneNumber}'`,
  );
};

const deleteLibraryMember = async (ssn: TMember['ssn']) => {
  await database.raw(`exec dbo.deleteLibraryMember @ssn = '${ssn}'`);
};

export { getMembers, getMember, insertMember, deleteLibraryMember };
