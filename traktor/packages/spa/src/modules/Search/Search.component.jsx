import {
  Box as MuiBox,
  Grid as MuiGrid,
  TextField as MuiTextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Pagination from '../../components/Pagination/Pagination.component';
import usePagination from '../../hooks/usePagination';
import {
  selectSearchResults,
  selectSearchResultsPagesTotal,
} from '../../redux/modules/search/search.selectors';
import { fetchSearchResults } from '../../redux/modules/search/search.slice';
import { renderInteractiveTileBasedOnType } from '../../utils';

function Search({ entity }) {
  const dispatch = useDispatch();
  const {
    hasNextPage,
    hasPreviousPage,
    page,
    pagesTotal,
    toFirstPage,
    toLastPage,
    toNextPage,
    toPreviousPage,
  } = usePagination(selectSearchResultsPagesTotal);
  const [searchParams, setSearchParams] = useSearchParams();
  const { query = '' } = useMemo(() => Object.fromEntries(searchParams), [
    searchParams,
  ]);
  const searchResults = useSelector(selectSearchResults);

  useEffect(() => {
    dispatch(fetchSearchResults({ entity, page, query }));
  }, [dispatch, entity, page, query]);

  function handleQueryChange(e) {
    if (e.keyCode !== 13) {
      return;
    }
    setSearchParams({ query: e.target.value });
  }

  return (
    <>
      <MuiBox m={2}>
        <MuiTextField
          color='secondary'
          defaultValue={query}
          label='What are you looking for?'
          onKeyDown={handleQueryChange}
          size='small'
          variant='outlined'
        />
      </MuiBox>
      <MuiGrid container>
        {searchResults.map((item) =>
          renderInteractiveTileBasedOnType({
            item,
            WrapperComponent: MuiGrid,
            WrapperProps: {
              item: true,
              lg: 2,
              md: 3,
              sm: 6,
              xs: 12,
            },
          }),
        )}
      </MuiGrid>
      <Pagination
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onFirstPage={toFirstPage}
        onLastPage={toLastPage}
        onNextPage={toNextPage}
        onPreviousPage={toPreviousPage}
        page={page}
        pagesTotal={pagesTotal}
      />
    </>
  );
}

Search.propTypes = {
  entity: PropTypes.oneOf(['all', 'movies', 'shows', 'people']),
};

export default Search;
