import axios from 'axios';
import type { Place, Spot } from 'parkingad-helpers/types';
import { useCallback, useEffect, useState } from 'react';

import { API } from '../utils/constants';

import type { Query, Response } from '@/utils/types';

const fetchPlaces = async (
  parking: Spot['name']
): Promise<Pick<Query<Place[]>, 'data' | 'error'>> => {
  try {
    const response = await axios.get<Response<Place[]>>(
      `${API}/spots/${parking}/places`
    );
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

const usePlaces = (parking: Spot['name']): Query<Place[]> => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchPlaces(parking);
    setPlaces(data);
    setError(error);
    setLoading(false);
  }, [parking]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    data: places,
    error,
    loading,
    refetch,
  };
};

export { fetchPlaces, usePlaces };
