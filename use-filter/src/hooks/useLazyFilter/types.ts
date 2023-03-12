import {
  type TProperty,
  type TPropertyOption,
  type TUseFilterProps,
  type TUseFilterResult,
} from '@/hooks/useFilter/types';

type TLazyProperty = Omit<TProperty, 'options'> & {
  options: (filter: string | null) => Promise<TPropertyOption[]>;
};

type TUseLazyFilterProps = Omit<TUseFilterProps, 'properties'> & {
  properties: Array<TLazyProperty | TProperty>;
};

type TUseLazyFilterResult = TUseFilterResult & {
  isFetching: boolean;
};

export type { TLazyProperty, TUseLazyFilterProps, TUseLazyFilterResult };
