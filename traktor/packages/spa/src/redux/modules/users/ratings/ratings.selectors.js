import { createSelector } from '@reduxjs/toolkit';

const selectRatings = createSelector(
  function (state) {
    return state.users.ratings.entities;
  },
  function (ratings) {
    return ratings;
  },
);

const selectRatingsPagesTotal = createSelector(
  function (state) {
    return state.users.ratings.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectRatings, selectRatingsPagesTotal };
