import { createSelector } from '@reduxjs/toolkit';

const selectShow = createSelector(
  function (state) {
    return state.show;
  },
  function (entity) {
    return entity;
  },
);

export { selectShow };
