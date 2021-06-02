import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { getUserSlug } from '../../../utils';

const fetchRecommendations = createAsyncThunk(
  'app/recommendations/fetch',
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(
        `/trakt/users/${getUserSlug()}/recommendations?extended=full`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchRecommendations.fulfilled](state, action) {
      return action.payload;
    },
  },
  initialState: [],
  name: 'app/recommendations',
  reducers: {},
});

export { fetchRecommendations };
export default reducer;
