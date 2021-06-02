import { createSelector } from '@reduxjs/toolkit';

function selectIsFollowedFactory() {
  return createSelector(
    function (state) {
      return state.app.connections.following;
    },
    function (_, slug) {
      return slug;
    },
    function (following, slug) {
      const result = following.find((user) => user.slug === slug);
      return Boolean(result);
    },
  );
}

export { selectIsFollowedFactory };
