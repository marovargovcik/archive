import axios from 'axios';
import { useQuery } from 'react-query';

import { logError } from '../../utils/logError';

const getBookAvailability = async (isbn) => {
  try {
    const response = await axios.get(`/books/${isbn}/availability`);
    return response.data.payload;
  } catch (error) {
    logError(error);
  }
};

const useBookAvailability = (isbn) => {
  return useQuery(['bookAvailability', isbn], () => getBookAvailability(isbn));
};

export { useBookAvailability };
