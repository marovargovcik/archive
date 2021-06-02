import { createSelector } from '@reduxjs/toolkit';

import { transformEntityToSingular } from '../../../utils';

function selectIsWatchlistedFactory() {
  return createSelector(
    [
      function (state) {
        return state.app.watchlist;
      },
      function (_, entity) {
        return transformEntityToSingular(entity);
      },
      function (_, __, slug) {
        return slug;
      },
    ],
    function (watchlist, entity, slug) {
      const result = watchlist.find(
        (item) => item.type === entity && item[entity].ids.slug === slug,
      );
      return Boolean(result);
    },
  );
}

export { selectIsWatchlistedFactory };
