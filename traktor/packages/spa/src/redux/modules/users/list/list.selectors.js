import { createSelector } from '@reduxjs/toolkit';

const selectList = createSelector(
  function (state) {
    return state.users.list.summary;
  },
  function (entity) {
    return entity;
  },
);

const selectListItems = createSelector(
  function (state) {
    return state.users.list.items.entities;
  },
  function (entities) {
    return entities;
  },
);

const selectListItemsPagesTotal = createSelector(
  function (state) {
    return state.users.list.items.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectList, selectListItems, selectListItemsPagesTotal };
