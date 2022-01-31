import fetch from 'node-fetch';
import type { Spot } from 'parkingad-helpers/types';
import { withRetry } from 'parkingad-helpers/withRetry';

const fetchSpots = async (): Promise<Spot[]> => {
  const response = await fetch(process.env.PARKINGSERVICE as string, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const spots = await response.text();
  return JSON.parse(spots) as Spot[];
};

const getSpots = async () => {
  const spots = await withRetry<Spot[]>(fetchSpots, 5);

  // ad service 5 consecutive failed requests
  if (!spots) {
    throw new Error('AD_SERVICE_UNREACHABLE');
  }

  return spots;
};

export { getSpots };
