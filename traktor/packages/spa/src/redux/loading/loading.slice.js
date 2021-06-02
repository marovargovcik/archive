import { createSlice } from '@reduxjs/toolkit';

function matches(action) {
  const patterns = ['/pending', '/fulfilled', '/rejected'];
  return patterns.some((pattern) => action.type.endsWith(pattern));
}

const { reducer } = createSlice({
  extraReducers: (builder) => {
    builder.addMatcher(matches, (state, action) => {
      const parts = action.type.split('/');
      const asyncState = parts.pop();
      state[`${parts.join('/')}`] = asyncState === 'pending';
    });
  },
  initialState: {},
  name: 'loading',
  reducers: {},
});

export default reducer;
