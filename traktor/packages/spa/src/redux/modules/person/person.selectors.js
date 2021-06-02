import { createSelector } from '@reduxjs/toolkit';

const selectPerson = createSelector(
  function (state) {
    return state.person;
  },
  function (entity) {
    return entity;
  },
);

export { selectPerson };
