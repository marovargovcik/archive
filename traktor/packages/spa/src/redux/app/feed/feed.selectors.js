import { createSelector } from '@reduxjs/toolkit';

const selectFeed = createSelector(
  function (state) {
    return state.app.feed;
  },
  function (feed) {
    return feed;
  },
);

export { selectFeed };
