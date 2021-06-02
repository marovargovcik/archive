import { createSelector } from '@reduxjs/toolkit';

const selectMovies = createSelector(
  function (state) {
    return state.movies.entities;
  },
  function (entities) {
    return entities;
  },
);

const selectMoviesPagesTotal = createSelector(
  function (state) {
    return state.movies.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectMovies, selectMoviesPagesTotal };
