import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS, filterOutUnsupportedEntityTypes } from '../../../../utils';

const fetchRatings = createAsyncThunk(
  'users/ratings/fetch',
  async function (
    { limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, userSlug },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/users/${userSlug}/ratings?page=${page}&limit=${limit}`,
      );
      return {
        entities: filterOutUnsupportedEntityTypes(response.data),
        total: parseInt(response.headers['x-pagination-page-count']),
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchRatings.fulfilled](state, action) {
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
  name: 'users/ratings',
  reducers: {},
});

export { fetchRatings };
export default reducer;
