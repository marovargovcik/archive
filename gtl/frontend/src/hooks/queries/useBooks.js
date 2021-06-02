import axios from 'axios';
import { useQuery } from 'react-query';

import { logError } from '../../utils/logError';

const getBooks = async ({ author, isbn, language, page, subject }) => {
  let queryParams = '';
  if (author) {
    queryParams += `lname=${author}&`;
  }
  if (isbn) {
    queryParams += `isbn=${isbn}&`;
  }
  if (language) {
    queryParams += `language=${language}&`;
  }
  if (page) {
    queryParams += `page=${page}&`;
  }
  if (subject) {
    queryParams += `subject=${subject}`;
  }
  try {
    const response = await axios.get(`/books?${queryParams}`);
    return response.data.payload;
  } catch (error) {
    logError(error);
  }
};

const useBooks = ({ author, isbn, language, page, subject }) => {
  return useQuery(
    ['books', author, isbn, language, page, subject],
    () => getBooks({ author, isbn, language, page, subject }),
    {
      keepPreviousData: true,
    }
  );
};

export { useBooks };
