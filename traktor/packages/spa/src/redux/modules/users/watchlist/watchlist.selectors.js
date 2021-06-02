import { createSelector } from '@reduxjs/toolkit';

const selectWatchlist = createSelector(
  function (state) {
    return state.users.watchlist.entities;
  },
  function (watchlist) {
    return watchlist;
  },
);

const selectWatchlistPagesTotal = createSelector(
  function (state) {
    return state.users.watchlist.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectWatchlist, selectWatchlistPagesTotal };
