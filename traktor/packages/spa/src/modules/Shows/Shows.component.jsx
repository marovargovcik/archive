import { Grid as MuiGrid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '../../components/Pagination/Pagination.component';
import usePagination from '../../hooks/usePagination';
import {
  selectShows,
  selectShowsPagesTotal,
} from '../../redux/modules/shows/shows.selectors';
import { fetchShows } from '../../redux/modules/shows/shows.slice';
import { renderTiles } from './Shows.utils';

function Shows({ category }) {
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
  } = usePagination(selectShowsPagesTotal);
  const shows = useSelector(selectShows);

  useEffect(() => {
    dispatch(fetchShows({ category, page }));
  }, [category, dispatch, page]);

  return (
    <>
      <MuiGrid container>{renderTiles({ category, shows })}</MuiGrid>
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

Shows.propTypes = {
  category: PropTypes.oneOf([
    'trending',
    'popular',
    'recommended',
    'watched',
    'anticipated',
  ]).isRequired,
};

export default Shows;
