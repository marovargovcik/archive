import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS, filterOutUnsupportedEntityTypes } from '../../../../utils';

const fetchWatchlist = createAsyncThunk(
  'users/watchlist/fetch',
  async function (
    { limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, userSlug },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/users/${userSlug}/watchlist?extended=full&page=${page}&limit=${limit}`,
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
    [fetchWatchlist.fulfilled](state, action) {
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
  name: 'users/watchlist',
  reducers: {},
});

export { fetchWatchlist };
export default reducer;
