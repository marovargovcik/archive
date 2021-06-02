import { createSelector } from '@reduxjs/toolkit';

const selectNotifications = createSelector(
  function (state) {
    return state.notifications;
  },
  function (notifications) {
    return notifications;
  },
);

export { selectNotifications };
