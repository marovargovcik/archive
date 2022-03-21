import { useSearchParams } from 'react-router-dom';

type TURLConnectedPagination = {
  limit?: number;
  total: number;
};

const useURLConnectedPagination = ({
  limit = 5,
  total,
}: TURLConnectedPagination) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPageFromURL = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isNaN(rawPageFromURL) ? 1 : rawPageFromURL;

  const availablePages = Math.ceil(total / limit);

  const hasNextPage = page < availablePages;

  const hasPreviousPage = page > 1;

  const goToNextPage = () => {
    if (!hasNextPage) {
      return;
    }

    searchParams.set('page', (page + 1).toString());
    setSearchParams(searchParams);
  };

  const goToPreviousPage = () => {
    if (!hasPreviousPage) {
      return;
    }

    searchParams.set('page', (page - 1).toString());
    setSearchParams(searchParams);
  };

  return {
    availablePages,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage,
    page,
  };
};

export type { TURLConnectedPagination };
export { useURLConnectedPagination };
