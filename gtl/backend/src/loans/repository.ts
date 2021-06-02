import database from '../utils/database';

import type { TBaseLoan, TReturnLoanBody } from './types';

const lendLoan = async ({ memberId, copyId }: TBaseLoan) => {
  const borrowDate = new Date();
  const dueDate = new Date(
    new Date().setDate(borrowDate.getDate() + 21),
  ).toLocaleDateString('fr-CA');
  const graceDate = new Date(
    new Date().setDate(borrowDate.getDate() + 14),
  ).toLocaleDateString('fr-CA');
  await database('loans').insert({
    borrowDate: borrowDate.toLocaleDateString('fr-CA'),
    copyId,
    dueDate,
    graceDate,
    memberId,
  });
};

const returnLoan = async ({
  memberId,
  copyId,
  borrowDate,
  condition,
}: TReturnLoanBody) => {
  await database.raw(
    'exec dbo.returnLoan @borrowDate = :borrowDate, @memberId = :memberId, @copyId = :copyId, @condition = :condition',
    { borrowDate, condition, copyId, memberId },
  );
};

const deleteLoan = async (parameters: Omit<TReturnLoanBody, 'condition'>) => {
  await database('loans').where(parameters).delete();
};

export { lendLoan, returnLoan, deleteLoan };
