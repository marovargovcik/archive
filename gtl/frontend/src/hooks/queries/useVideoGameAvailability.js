import axios from 'axios';
import { useQuery } from 'react-query';

import { logError } from '../../utils/logError';

const getVideoGameAvailability = async (_id) => {
  try {
    const response = await axios.get(`/video-games/${_id}/availability`);
    return response.data.payload;
  } catch (error) {
    logError(error);
  }
};

const useVideoGameAvailability = (_id) => {
  return useQuery(['videoGameAvailability', _id], () =>
    getVideoGameAvailability(_id)
  );
};

export { useVideoGameAvailability };
