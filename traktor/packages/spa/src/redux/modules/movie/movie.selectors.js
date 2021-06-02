import { createSelector } from '@reduxjs/toolkit';

const selectMovie = createSelector(
  function (state) {
    return state.movie;
  },
  function (entity) {
    return entity;
  },
);

export { selectMovie };
