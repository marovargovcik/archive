import axios from 'axios';
import { useQuery } from 'react-query';

import type { TChild } from '@/types/models';

type TGetChildrenResponse = {
  children: TChild[];
};

const getChildren = async () => {
  try {
    const URL = [
      '/daycare/tablet/group?',
      `accessToken=${import.meta.env.VITE_API_KEY}&`,
      'groupId=86413ecf-01a1-44da-ba73-1aeda212a196&',
      'institutionId=dc4bd858-9e9c-4df7-9386-0d91e42280eb',
    ].join('');
    const results = await axios.get<TGetChildrenResponse>(URL);
    return results.data;
  } catch {
    return {
      children: [],
    };
  }
};

const useChildrenQuery = () =>
  useQuery<TGetChildrenResponse>('children', () => getChildren(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

export type { TGetChildrenResponse };
export { getChildren, useChildrenQuery };
