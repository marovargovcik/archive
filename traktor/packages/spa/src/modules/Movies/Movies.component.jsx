import { Grid as MuiGrid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from '../../components/Pagination/Pagination.component';
import usePagination from '../../hooks/usePagination';
import {
  selectMovies,
  selectMoviesPagesTotal,
} from '../../redux/modules/movies/movies.selectors';
import { fetchMovies } from '../../redux/modules/movies/movies.slice';
import { renderTiles } from './Movies.utils';

function Movies({ category }) {
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
  } = usePagination(selectMoviesPagesTotal);
  const movies = useSelector(selectMovies);

  useEffect(() => {
    dispatch(fetchMovies({ category, page }));
  }, [category, dispatch, page]);

  return (
    <>
      <MuiGrid container>{renderTiles({ category, movies })}</MuiGrid>
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

Movies.propTypes = {
  category: PropTypes.oneOf([
    'trending',
    'popular',
    'recommended',
    'watched',
    'anticipated',
  ]).isRequired,
};

export default Movies;
