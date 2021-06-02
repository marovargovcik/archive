import type { Request } from 'express';

type TBaseLoan = {
  memberId: string;
  copyId: number;
};

type TLoan = TBaseLoan & {
  borrowDate: string;
  returnDate: string;
  dueDate: string;
  graceDate: string;
};

type TReturnLoanBody = TBaseLoan & {
  borrowDate: TLoan['borrowDate'];
  condition: string;
};

type TPatchLoanRequest = Request<{}, {}, TReturnLoanBody>;

type TPostLoanRequest = Request<{}, {}, TBaseLoan>;

export type {
  TBaseLoan,
  TLoan,
  TPatchLoanRequest,
  TPostLoanRequest,
  TReturnLoanBody,
};
