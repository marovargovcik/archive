import { useCallback, useEffect, useMemo, useState } from 'react';

import { useFilter } from '@/hooks/useFilter/hook';
import { type TProperty, type TPropertyOption } from '@/hooks/useFilter/types';
import { findPropertyByKey } from '@/hooks/useFilter/utils';
import {
  type TLazyProperty,
  type TUseLazyFilterProps,
} from '@/hooks/useLazyFilter/types';
import {
  isLazyProperty,
  transformLazyPropertiesToRegular,
} from '@/hooks/useLazyFilter/utils';

const useLazyFilter = ({
  properties: lazyProperties,
  ...props
}: TUseLazyFilterProps) => {
  // Because "lazyProperties" can be either of type TLazyProperty or TProperty
  // and useFilter expects "properties" of TProperty[] type we have to do the transformation
  // Transformation function does replace options property of type "() => Promise<TPropertyOption[]>"
  // to options: [] (empty array) as options will be lazy fetched
  const properties = useMemo<TProperty[]>(
    () => transformLazyPropertiesToRegular(lazyProperties),
    [lazyProperties]
  );

  const { addFilter, clearFilters, property, query, removeFilter } = useFilter({
    properties,
    ...props,
  });

  const [isFetchingLazyOptions, setIsFetchingLazyOptions] = useState(false);

  // Lazily fetched options of currently selected lazy property
  // Value is null when a not lazy property is selected
  // otherwise it is an empty array
  const [lazyOptions, setLazyOptions] = useState<TPropertyOption[] | null>(
    null
  );

  // Flag to detect whether option has lazy options
  // Property has lazyOptions when the value of lazyOptions is not null
  const hasLazyOptions = useMemo(() => lazyOptions !== null, [lazyOptions]);

  const loadLazyOptions = useCallback(async () => {
    // If no property is selected then set lazy options to null
    if (property === null) {
      setLazyOptions(null);
      return;
    }

    // It is necessary to find original lazy property as the "property" returned from "useFilter" hook
    // is of type TProperty where options is not a () => Promise<TPropertyOption[]> but TPropertyOption[] instead.
    // This is because of the transformation of "lazyProperties" to "regularProperties".
    // We can find the original lazy property by looking up the key. But it might not be a lazy property.
    const maybeLazyProperty = findPropertyByKey<TLazyProperty | TProperty>(
      property.key,
      lazyProperties
    );

    // If for some reason the property is not found fallback to lazyOptions being null
    if (maybeLazyProperty === undefined) {
      setLazyOptions(null);
      return;
    }

    // If "maybeLazyProperty" is lazy property then options property is a function of type () => Promise<TPropertyOption[]>
    // Await that promise to load lazy options. This promise can be a API request or async computation.
    if (isLazyProperty(maybeLazyProperty)) {
      try {
        setIsFetchingLazyOptions(true);
        const options = await maybeLazyProperty.options(query);
        setLazyOptions(options);
      } catch {
        setLazyOptions([]);
      } finally {
        setIsFetchingLazyOptions(false);
      }

      return;
    }

    // Otherwise "maybeLazyProperty" is not lazy property (TLazyProperty) but regular property (TProperty)
    // In that case set lazy options to null
    setLazyOptions(null);
  }, [lazyProperties, property, query]);

  useEffect(() => {
    void loadLazyOptions();
  }, [loadLazyOptions]);

  // It is necessary to recompute the "property" as it can be lazy property
  // If "hasLazyOptions" evaluates to true then we override the "options" property with lazily fetched options
  const maybeLazyProperty = useMemo<TProperty | null>(() => {
    if (property && hasLazyOptions) {
      return {
        ...property,
        options: lazyOptions,
      };
    }

    return property;
  }, [hasLazyOptions, lazyOptions, property]);

  return {
    addFilter,
    clearFilters,
    isFetching: isFetchingLazyOptions,
    property: maybeLazyProperty,
    query,
    removeFilter,
  };
};

export { useLazyFilter };
