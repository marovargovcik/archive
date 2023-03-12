import { useCallback, useMemo } from 'react';

import {
  type TFilter,
  type TProperty,
  type TUseFilterProps,
  type TUseFilterResult,
} from '@/hooks/useFilter/types';
import {
  findPropertyByLabel,
  isFilterDuplicate,
  isStringFilter,
} from '@/hooks/useFilter/utils';

const useFilter = ({
  delimiter = ': ',
  filters,
  input,
  onFiltersChange,
  properties,
}: TUseFilterProps): TUseFilterResult => {
  const [property, query]: [TProperty | null, string | null] = useMemo(() => {
    // Skip any computation if "input" is equal to empty string
    // or input do not include delimiter
    if (input === '' || input.includes(delimiter) === false) {
      return [null, null];
    }

    // Split the input by delimiter into label and value
    // Example:
    //  delimiter = ": "
    //  input = "Name: John"
    // then
    //  label = "Name"
    //  query = "John"
    const [label, query] = input.split(delimiter);

    const property = findPropertyByLabel(label, properties);

    if (property === undefined) {
      return [null, null];
    }

    return [property, query || null];
  }, [input, delimiter, properties]);

  const addFilter = useCallback(
    (candidateFilter: TFilter) => {
      // If "candidateFilter" is already present in "filters"
      // then skip any action
      if (isFilterDuplicate(candidateFilter, filters)) {
        return;
      }

      // If filter that should be added can occur multiple times
      // in the filters then add the filter at the end of the "filters" array
      if (candidateFilter.property.multiple) {
        onFiltersChange([...filters, candidateFilter]);
        return;
      }

      // Filter out "candidateFilter" from "filters" array just in case it is present
      // It is necessary as it is now known that "candidateFilter" cannot occur in
      // "filters" array multiple times (because of previous if condition)
      const otherFilters = filters.filter(
        (filter) => filter.property.key !== candidateFilter.property.key
      );

      onFiltersChange([...otherFilters, candidateFilter]);
    },
    [filters, onFiltersChange]
  );

  const removeFilter = useCallback(
    (candidateFilter: TFilter) => {
      const changedFilters = filters.filter((iteratedFilter) => {
        // Keep filter if the currently iterated filter is not the one
        // that is supposed to be removed
        if (iteratedFilter.property.key !== candidateFilter.property.key) {
          return true;
        }

        if (isStringFilter(iteratedFilter)) {
          // If both "iteratedFilter" and "candidateFilter" are string filters
          // compare their values
          if (isStringFilter(candidateFilter)) {
            const areFilterValuesEqual =
              iteratedFilter.value === candidateFilter.value;

            // If values are the same then "iteratedFilter" and "candidateFilter" are
            // the same filter and it should be removed
            if (areFilterValuesEqual) {
              return false;
            }

            // If values do not match keep the filter
            return true;
          }

          // If "candidateFilter" is not string filter then keep the "iteratedFilter"
          // as it is not the filter that should be removed
          return true;
        }

        // "iteratedFilter" is option filter
        // if "candidateFilter" is string filter then it is not the filter
        // that should be removed
        if (isStringFilter(candidateFilter)) {
          return true;
        }

        // both "iteratedFilter" and "candidateFilter" are option filters
        // we can check option value of both and compare them
        const areFilterValuesEqual =
          iteratedFilter.option.value === candidateFilter.option.value;

        // if values are equal then "iteratedFilter" is "candidateFilter" which should be removed
        if (areFilterValuesEqual) {
          return false;
        }

        return true;
      });
      onFiltersChange(changedFilters);
    },
    [filters, onFiltersChange]
  );

  const clearFilters = useCallback(
    () => onFiltersChange([]),
    [onFiltersChange]
  );

  return {
    addFilter,
    clearFilters,
    property,
    query,
    removeFilter,
  };
};

export { useFilter };
