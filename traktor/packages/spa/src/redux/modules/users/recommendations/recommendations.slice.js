import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS } from '../../../../utils';

const fetchRecommendations = createAsyncThunk(
  'users/recommendations/fetch',
  async function (
    { limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, userSlug },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/users/${userSlug}/recommendations?extended=full&page=${page}&limit=${limit}`,
      );
      return {
        entities: response.data,
        total: parseInt(response.headers['x-pagination-page-count']),
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchRecommendations.fulfilled](state, action) {
      state.entities = action.payload.entities;
      state.pagination.total = action.payload.total;
    },
  },
  initialState: {
    entities: [],
    pagination: {
      total: 0,
    },
  },
  name: 'users/recommendations',
  reducers: {},
});

export { fetchRecommendations };
export default reducer;
