import fetch from 'node-fetch';
import { redisRO, redisWO } from 'parkingad-helpers/redis';
import { withRetry } from 'parkingad-helpers/withRetry';

const fetchAdvertisement = async (): Promise<string> => {
  const response = await fetch(process.env.ADSERVICE as string, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const advertisement = await response.text();
  if (advertisement.includes('Something bad happened, Sorry.')) {
    throw new Error('REQUEST_FAILED');
  }

  return advertisement;
};

const getAdvertisement = async (): Promise<string> => {
  let advertisement = await redisRO.get('advertisement');

  // cache miss
  if (!advertisement) {
    advertisement = await withRetry<string>(fetchAdvertisement, 5);

    // ad service 5 consecutive failed requests
    if (!advertisement) {
      throw new Error('AD_SERVICE_UNREACHABLE');
    }

    await redisWO.set('advertisement', advertisement, {
      EX: 120,
    });
  }

  return advertisement;
};

export { getAdvertisement };
