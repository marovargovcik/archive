import axios from 'axios';
import type { Place, Spot } from 'parkingad-helpers/types';
import { useCallback, useEffect, useState } from 'react';

import { API } from '../utils/constants';

import type { Query, Response } from '@/utils/types';

const fetchAds = async (): Promise<Pick<Query<string>, 'data' | 'error'>> => {
  try {
    const response = await axios.get<Response<string>>(`${API}/advertisement`);
    return { data: response.data.payload, error: false };
  } catch {
    return {
      data: '',
      error: true,
    };
  }
};

const useAds = (): Query<string> => {
  const [advertisements, setAdvertisements] = useState<string>('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchAds();
    setAdvertisements(data);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data: advertisements,
    error,
    loading,
    refetch,
  };
};

export { fetchAds, useAds };
