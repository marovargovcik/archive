import axios from 'axios';
import { useMutation } from 'react-query';

import { logError } from '../../utils/logError';
import { transformApiErrorsArrayToMap } from '../../utils/transformApiErrorsArrayToMap';
import { useAuth } from '../stores/useAuth';

const login = async ({ password, ssn }) => {
  try {
    const response = await axios.post('/auth/login', {
      password,
      ssn,
    });
    const { accessToken, refreshToken } = response.data.payload;
    useAuth.getState().set({
      accessToken,
      refreshToken,
    });
    return response.data.payload;
  } catch (error) {
    return Promise.reject(transformApiErrorsArrayToMap(logError(error)));
  }
};

const useLogin = (options) => {
  return useMutation(({ password, ssn }) => login({ password, ssn }), options);
};

export { useLogin };
