import axios from 'axios';
import { useMutation } from 'react-query';

import { logError } from '../../utils/logError';
import { transformApiErrorsArrayToMap } from '../../utils/transformApiErrorsArrayToMap';

const createNewMember = async ({
  address1,
  address2,
  address3,
  campus,
  city,
  fname,
  lname,
  phoneNumber,
  ssn,
  zipCode,
}) => {
  try {
    const response = await axios.post('/members', {
      address1,
      address2,
      address3,
      campus,
      city,
      fname,
      isProfessor: false,
      lname,
      phoneNumber,
      ssn,
      zipCode,
    });
    return response.data.payload;
  } catch (error) {
    return Promise.reject(transformApiErrorsArrayToMap(logError(error)));
  }
};

const useNewMember = (options) => {
  return useMutation(
    ({
      address1,
      address2,
      address3,
      campus,
      city,
      fname,
      lname,
      phoneNumber,
      ssn,
      zipCode,
    }) =>
      createNewMember({
        address1,
        address2,
        address3,
        campus,
        city,
        fname,
        lname,
        phoneNumber,
        ssn,
        zipCode,
      }),
    options
  );
};

export { useNewMember };
