import axios from 'axios';
import type { Spot } from 'parkingad-helpers/types';
import { useCallback, useEffect, useState } from 'react';

import { API } from '../utils/constants';

import type { Query, Response } from '@/utils/types';

const fetchSpots = async (): Promise<Pick<Query<Spot[]>, 'data' | 'error'>> => {
  try {
    const response = await axios.get<Response<Spot[]>>(`${API}/spots`);
    return {
      data: response.data.payload,
      error: false,
    };
  } catch {
    return {
      data: [],
      error: true,
    };
  }
};

const useSpots = (): Query<Spot[]> => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchSpots();
    setSpots(data);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data: spots,
    error,
    loading,
    refetch,
  };
};

export { fetchSpots, useSpots };
