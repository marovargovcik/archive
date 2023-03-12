import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { type TFilter, type TKeyValuePairs } from '@/hooks/useFilter/types';
import { useLazyFilter } from '@/hooks/useLazyFilter/hook';
import { type TUseURLConnectedFilterProps } from '@/hooks/useURLConnectedFilter/types';
import {
  splitSearchParamsIntoValidFilterPropertiesAndRest,
  transformFiltersToSearchParams,
  transformSearchParamsToFilters,
  transformSearchParamsToKeyValuePairs,
} from '@/hooks/useURLConnectedFilter/utils';

const useURLConnectedFilter = ({
  input,
  properties: lazyProperties,
}: TUseURLConnectedFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [validFilterPropertySearchParams, unrelatedSearchParams] =
    useMemo(() => {
      const searchParamsAsKeyValuePairs =
        transformSearchParamsToKeyValuePairs(searchParams);

      return splitSearchParamsIntoValidFilterPropertiesAndRest(
        searchParamsAsKeyValuePairs,
        lazyProperties
      );
    }, [lazyProperties, searchParams]);

  const [filters] = useMemo(() => {
    const filters = transformSearchParamsToFilters(
      validFilterPropertySearchParams,
      lazyProperties
    );

    return [
      filters,
      transformFiltersToSearchParams<TKeyValuePairs>(filters, lazyProperties),
      transformFiltersToSearchParams<TKeyValuePairs>(
        filters,
        lazyProperties,
        true
      ),
    ];
  }, [lazyProperties, validFilterPropertySearchParams]);

  const handleFiltersChange = useCallback(
    (filters: TFilter[]) =>
      setSearchParams({
        ...transformFiltersToSearchParams<TKeyValuePairs>(
          filters,
          lazyProperties
        ),
        ...unrelatedSearchParams,
      }),
    [lazyProperties, setSearchParams, unrelatedSearchParams]
  );

  const { addFilter, clearFilters, isFetching, property, query, removeFilter } =
    useLazyFilter({
      filters,
      input,
      onFiltersChange: handleFiltersChange,
      properties: lazyProperties,
    });

  return {
    addFilter,
    clearFilters,
    filters,
    isFetching,
    property,
    query,
    removeFilter,
  };
};

export { useURLConnectedFilter };
