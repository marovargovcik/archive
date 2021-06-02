import type { TPerson } from '../utils/types';

type TStaffPerson = {
  ssn: TPerson['ssn'];
  role: string;
  passwordHash: Buffer;
};

type TStaffPersonWithoutPasswordHash = Omit<TStaffPerson, 'passwordHash'>;

export type { TStaffPerson, TStaffPersonWithoutPasswordHash };
