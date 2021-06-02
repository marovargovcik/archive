import { createSelector } from '@reduxjs/toolkit';

const selectSearchResults = createSelector(
  function (state) {
    return state.search.entities;
  },
  function (entities) {
    return entities;
  },
);

const selectSearchResultsPagesTotal = createSelector(
  function (state) {
    return state.search.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectSearchResults, selectSearchResultsPagesTotal };
