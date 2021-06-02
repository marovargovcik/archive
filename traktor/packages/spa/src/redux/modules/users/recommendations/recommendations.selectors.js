import { createSelector } from '@reduxjs/toolkit';

const selectRecommendations = createSelector(
  function (state) {
    return state.users.recommendations.entities;
  },
  function (recommendations) {
    return recommendations;
  },
);

const selectRecommendationsPagesTotal = createSelector(
  function (state) {
    return state.users.recommendations.pagination.total;
  },
  function (pagesTotal) {
    return pagesTotal;
  },
);

export { selectRecommendations, selectRecommendationsPagesTotal };
