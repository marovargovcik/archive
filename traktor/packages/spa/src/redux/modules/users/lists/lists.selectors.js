import { createSelector } from '@reduxjs/toolkit';

const selectLists = createSelector(
  function (state) {
    return state.users.lists;
  },
  function (lists) {
    return lists;
  },
);

export { selectLists };
