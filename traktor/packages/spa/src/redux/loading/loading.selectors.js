import { createSelector } from '@reduxjs/toolkit';

function stateSelector(state) {
  return state.loading;
}

// Action types can be a string or array of strings
function selector(_, actionTypes) {
  return actionTypes;
}

const selectLoadingFlag = createSelector(
  [stateSelector, selector],
  function (loading, actionType) {
    return Boolean(loading[actionType]);
  },
);

function selectLoadingFlagsFactory() {
  return createSelector(
    [stateSelector, selector],
    function (state, actionTypes) {
      return Object.keys(state.loading)
        .filter((action) => actionTypes.includes(action))
        .map((action) => state.loading[action]);
    },
  );
}

function selectLoadingFlagsReducedFactory() {
  return createSelector(
    [stateSelector, selector],
    function (state, actionTypes) {
      return Object.keys(state)
        .filter((action) => actionTypes.includes(action))
        .some((action) => state[action]);
    },
  );
}

export {
  selectLoadingFlag,
  selectLoadingFlagsFactory,
  selectLoadingFlagsReducedFactory,
};
