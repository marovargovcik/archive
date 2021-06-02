import type { Request } from 'express';
import type { IBasePagination } from 'knex-paginate';

import type {
  TPerson,
  TPersonAddress,
  TPersonPhoneNumber,
} from '../utils/types';

type TMember = TPerson &
  TPersonAddress &
  TPersonPhoneNumber & {
    campus: string;
    isProfessor: boolean;
  };

type TGetMembersPagination = {
  page?: string;
};

type TGetMembersRequest = Request<
  {},
  {},
  {},
  {
    page?: string;
  }
>;

type TGetMembersResponsePayload = {
  data: TMemberWithAddressesAndPhoneNumbers[];
  pagination: IBasePagination;
};

type TGetMemberRequest = Request<{
  ssn: TMember['ssn'];
}>;

type TPostMemberRequest = Request<{}, {}, TMember>;

type TDeleteRequest = Request<{
  ssn: TMember['ssn'];
}>;

type TMembersNormalized = {
  [ssn: string]: TMemberWithAddressesAndPhoneNumbers;
};

type TMemberWithAddressesAndPhoneNumbers = Omit<
  TMember,
  'address1' | 'address2' | 'address3' | 'city' | 'phoneNumber' | 'zipCode'
> & {
  addresses: TPersonAddress[];
  phoneNumbers: string[];
};

export type {
  TMember,
  TGetMemberRequest,
  TGetMembersRequest,
  TGetMembersResponsePayload,
  TGetMembersPagination,
  TPostMemberRequest,
  TDeleteRequest,
  TMembersNormalized,
  TMemberWithAddressesAndPhoneNumbers,
};
