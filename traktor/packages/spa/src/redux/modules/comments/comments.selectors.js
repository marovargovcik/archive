import { createSelector } from '@reduxjs/toolkit';

const selectComments = createSelector(
  function (state) {
    return state.comments.entities;
  },
  function (entities) {
    return entities;
  },
);

const selectCommentsPagesTotal = createSelector(
  function (state) {
    return state.comments.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectComments, selectCommentsPagesTotal };
