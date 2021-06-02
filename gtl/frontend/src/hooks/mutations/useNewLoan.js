import axios from 'axios';
import { useMutation } from 'react-query';

import { logError } from '../../utils/logError';
import { transformApiErrorsArrayToMap } from '../../utils/transformApiErrorsArrayToMap';

const loan = async ({ copyId, memberId }) => {
  try {
    const response = await axios.post('/loans', {
      copyId,
      memberId,
    });
    return response.data.payload;
  } catch (error) {
    return Promise.reject(transformApiErrorsArrayToMap(logError(error)));
  }
};

const useNewLoan = (options) => {
  return useMutation(
    ({ copyId, memberId }) => loan({ copyId, memberId }),
    options
  );
};

export { useNewLoan };
