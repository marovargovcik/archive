import { createSelector } from '@reduxjs/toolkit';

import { transformEntityToSingular } from '../../../utils';

function selectListsForManagerFactory() {
  return createSelector(
    function (state) {
      return state.app.lists;
    },
    function (_, entity) {
      return entity;
    },
    function (_, __, slug) {
      return slug;
    },
    function (lists, entity, slug) {
      entity = transformEntityToSingular(entity);
      return lists.map((list) => {
        const listed = list.items.some(
          (item) => item.type === entity && item[entity].ids.slug === slug,
        );
        return {
          listed,
          name: list.name,
          slug: list.ids.slug,
        };
      });
    },
  );
}

export { selectListsForManagerFactory };
