import axios from 'axios';
import { useQuery } from 'react-query';

import { logError } from '../../utils/logError';

const getVideoGames = async () => {
  try {
    const response = await axios.get('/video-games');
    return response.data.payload;
  } catch (error) {
    logError(error);
  }
};

const useVideoGames = () => {
  return useQuery('videoGames', () => getVideoGames(), {
    keepPreviousData: true,
  });
};

export { useVideoGames };
