type TStringFilter = {
  property: TProperty;
  value: string;
};

type TOptionFilter = {
  option: TPropertyOption;
  property: TProperty;
};

type TFilter = TOptionFilter | TStringFilter;

type TProperty = {
  key: string;
  label: string;
  multiple: boolean;
  options: TPropertyOption[] | null;
};

type TPropertyOption = {
  label: string;
  value: string;
};

type TUseFilterProps = {
  delimiter?: string;
  filters: TFilter[];
  input: string;
  onFiltersChange: (filters: TFilter[]) => void;
  properties: TProperty[];
};

type TUseFilterResult = {
  addFilter: (filter: TFilter) => void;
  clearFilters: () => void;
  property: TProperty | null;
  query: string | null;
  removeFilter: (filter: TFilter) => void;
};

type TKeyValuePairs = Record<string, string>;

export type {
  TStringFilter,
  TOptionFilter,
  TFilter,
  TProperty,
  TPropertyOption,
  TUseFilterProps,
  TUseFilterResult,
  TKeyValuePairs,
};
