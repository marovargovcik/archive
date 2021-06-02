import type { Request } from 'express';
import type { IBasePagination } from 'knex-paginate';

import type { TLoan } from '../loans/types';

type TGetBooksRequest = Request<
  {},
  {},
  {},
  TGetBooksFilter & TGetBooksPagination
>;

type TGetBookAvailabilityRequest = Request<Pick<TBook, 'isbn'>>;

type TGetBookAvailabilityResponsePayload = Array<{
  copyId: TLoan['copyId'];
  returnDate: TLoan['returnDate'];
  graceDate: TLoan['graceDate'];
}>;

type TGetBooksResponsePayload = {
  data: TBookWithAuthorsAndSubjects[];
  pagination: IBasePagination;
};

type TBook = {
  isbn: string;
  title: string;
  description: string;
  edition: string;
  language: string;
  bindingType: string;
  itemId: number;
  author: string;
  subject: string;
};

type TBooksNormalized = {
  [isbn: string]: TBookWithAuthorsAndSubjects;
};

type TBookWithAuthorsAndSubjects = Omit<TBook, 'author' | 'subject'> & {
  authors: string[];
  subjects: string[];
};

type TGetBooksFilter = {
  isbn?: string;
  language?: string;
  subject?: string;
  edition?: string;
  lname?: string;
  bindingType?: string;
};

type TGetBooksPagination = {
  page?: string;
};

export type {
  TBook,
  TBooksNormalized,
  TBookWithAuthorsAndSubjects,
  TGetBooksFilter,
  TGetBooksPagination,
  TGetBooksRequest,
  TGetBooksResponsePayload,
  TGetBookAvailabilityRequest,
  TGetBookAvailabilityResponsePayload,
};
