import { createSlice, nanoid } from '@reduxjs/toolkit';

function matches(action) {
  return action.type.endsWith('/rejected');
}

const { actions, reducer } = createSlice({
  extraReducers: (builder) => {
    builder.addMatcher(matches, (state, action) => {
      state[action.meta.requestId] = action.payload;
    });
  },
  initialState: {},
  name: 'notifications',
  reducers: {
    createNotification: {
      prepare(message) {
        return {
          payload: {
            id: nanoid(),
            message,
          },
        };
      },
      reducer(state, action) {
        state[action.payload.id] = action.payload.message;
      },
    },
    removeNotification(state, action) {
      delete state[action.payload];
    },
  },
});

const { createNotification, removeNotification } = actions;

export { createNotification, removeNotification };
export default reducer;
