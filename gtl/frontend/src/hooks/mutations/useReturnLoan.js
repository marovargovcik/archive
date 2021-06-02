import axios from 'axios';
import { useMutation } from 'react-query';

import { logError } from '../../utils/logError';
import { transformApiErrorsArrayToMap } from '../../utils/transformApiErrorsArrayToMap';

const returnLoan = async ({ borrowDate, condition, copyId, memberId }) => {
  try {
    const response = await axios.patch('/loans', {
      borrowDate,
      condition,
      copyId,
      memberId,
    });
    return response.data.payload;
  } catch (error) {
    return Promise.reject(transformApiErrorsArrayToMap(logError(error)));
  }
};

const useReturnLoan = (options) => {
  return useMutation(
    ({ borrowDate, condition, copyId, memberId }) =>
      returnLoan({ borrowDate, condition, copyId, memberId }),
    options
  );
};

export { useReturnLoan };
