import { createSelector } from '@reduxjs/toolkit';

const selectComments = createSelector(
  function (state) {
    return state.users.comments.entities;
  },
  function (comments) {
    return comments;
  },
);

const selectCommentsPagesTotal = createSelector(
  function (state) {
    return state.users.comments.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectComments, selectCommentsPagesTotal };
