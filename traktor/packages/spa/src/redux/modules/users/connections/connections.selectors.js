import { createSelector } from '@reduxjs/toolkit';

const selectConnections = createSelector(
  function (state) {
    return state.users.connections;
  },
  function (connections) {
    return connections;
  },
);

export { selectConnections };
