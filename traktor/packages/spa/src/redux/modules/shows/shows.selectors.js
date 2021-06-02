import { createSelector } from '@reduxjs/toolkit';

const selectShows = createSelector(
  function (state) {
    return state.shows.entities;
  },
  function (shows) {
    return shows;
  },
);

const selectShowsPagesTotal = createSelector(
  function (state) {
    return state.shows.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectShows, selectShowsPagesTotal };
