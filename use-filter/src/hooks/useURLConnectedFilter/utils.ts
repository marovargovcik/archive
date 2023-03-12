import {
  type TFilter,
  type TKeyValuePairs,
  type TProperty,
} from '@/hooks/useFilter/types';
import {
  findPropertyByKey,
  findPropertyOptionByValue,
  isOptionsFilter,
  isPropertyWithOptions,
  isStringFilter,
} from '@/hooks/useFilter/utils';
import { type TLazyProperty } from '@/hooks/useLazyFilter/types';
import {
  isLazyProperty,
  transformLazyPropertyToRegular,
} from '@/hooks/useLazyFilter/utils';

const isValidFilterProperty = (value: string, isMultiple = false) => {
  if (!isMultiple && value.includes(',')) {
    return false;
  }

  return !value.split(',').some((value) => !value);
};

const isValidFilterLazyPropertyOption = (values: string[]) => {
  if (values.some((value) => !value.includes(':'))) {
    return false;
  }

  return !values
    .map((value) => value.split(':'))
    .some(([label, value]) => label === '' || value === '');
};

const transformSearchParamsToKeyValuePairs = (searchParams: URLSearchParams) =>
  Object.fromEntries(searchParams);

const splitSearchParamsIntoValidFilterPropertiesAndRest = (
  searchParams: TKeyValuePairs,
  properties: Array<TLazyProperty | TProperty>
) =>
  Object.entries(searchParams).reduce<[TKeyValuePairs, TKeyValuePairs]>(
    (accumulator, [key, value]) => {
      const validFilterPropertySearchParams = accumulator[0];
      const unrelatedSearchParams = accumulator[1];

      const property = findPropertyByKey(key, properties);
      if (!property) {
        unrelatedSearchParams[key] = value;
        return accumulator;
      }

      if (!isValidFilterProperty(value, property.multiple)) {
        return accumulator;
      }

      let values = value.split(',');
      if (!property.multiple) {
        values = values.slice(0, 1);
      }

      if (isLazyProperty(property)) {
        if (isValidFilterLazyPropertyOption(values)) {
          validFilterPropertySearchParams[key] = value;
        }

        return accumulator;
      }

      if (isPropertyWithOptions(property)) {
        values = values.filter((value) =>
          findPropertyOptionByValue(value, property.options)
        );
      }

      validFilterPropertySearchParams[key] = values.join(',');
      return accumulator;
    },
    [{}, {}]
  );

const transformSearchParamsToFilters = (
  searchParams: TKeyValuePairs,
  lazyProperties: Array<TLazyProperty | TProperty>
) =>
  Object.entries(searchParams).reduce<TFilter[]>(
    (accumulator, [key, value]) => {
      const property = findPropertyByKey(key, lazyProperties);
      if (!property) {
        return accumulator;
      }

      if (!isValidFilterProperty(value, property.multiple)) {
        return accumulator;
      }

      let values = value.split(',');
      if (!property.multiple) {
        values = values.slice(0, 1);
      }

      if (isLazyProperty(property)) {
        if (isValidFilterLazyPropertyOption(values)) {
          for (const [label, value] of values.map((value) => value.split(':')))
            accumulator.push({
              option: {
                label,
                value,
              },
              property: transformLazyPropertyToRegular(property),
            });
        }

        return accumulator;
      }

      if (isPropertyWithOptions(property)) {
        for (const value of values) {
          const option = findPropertyOptionByValue(value, property.options);
          if (!option) {
            continue;
          }

          accumulator.push({
            option,
            property,
          });
        }

        return accumulator;
      }

      for (const value of values) {
        accumulator.push({
          property,
          value,
        });
      }

      return accumulator;
    },
    []
  );

const transformFiltersToSearchParams = <T extends TKeyValuePairs>(
  filters: TFilter[],
  properties: Array<TLazyProperty | TProperty>,
  omitLabels = false
) =>
  filters.reduce<TKeyValuePairs>((accumulator, filter) => {
    const originalProperty = findPropertyByKey<TLazyProperty | TProperty>(
      filter.property.key,
      properties
    );

    const { key } = filter.property;

    if (!omitLabels && isLazyProperty(originalProperty)) {
      if (isOptionsFilter(filter)) {
        const { label, value } = filter.option;
        accumulator[key] = accumulator[key]
          ? `${accumulator[key]},${label}:${value}`
          : `${label}:${value}`;
      }

      return accumulator;
    }

    const value = isStringFilter(filter) ? filter.value : filter.option.value;
    accumulator[key] = accumulator[key]
      ? `${accumulator[key]},${value}`
      : value;

    return accumulator;
  }, {}) as T;

export {
  isValidFilterProperty,
  isValidFilterLazyPropertyOption,
  transformSearchParamsToKeyValuePairs,
  splitSearchParamsIntoValidFilterPropertiesAndRest,
  transformFiltersToSearchParams,
  transformSearchParamsToFilters,
};
