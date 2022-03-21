type TUseLocalPaginationStrategyProps<T> = {
  data: T[];
  limit: number;
  page: number;
};

const useLocalPaginationStrategy = <T>({
  data,
  limit,
  page,
}: TUseLocalPaginationStrategyProps<T>) =>
  data.slice((page - 1) * limit, page * limit);

export type { TUseLocalPaginationStrategyProps };
export { useLocalPaginationStrategy };
