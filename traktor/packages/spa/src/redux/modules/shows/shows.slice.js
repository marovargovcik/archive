import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS } from '../../../utils';

const fetchShows = createAsyncThunk(
  'shows/fetch',
  async function (
    { category, limit = DEFAULTS.PAGE_SIZE, page = 1 },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/shows/${category}?page=${page}&limit=${limit}&extended=full`,
      );
      if (category === 'popular') {
        response.data = response.data.map((item) => ({ show: item }));
      }
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
    [fetchShows.fulfilled](state, action) {
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
  name: 'shows',
  reducers: {},
});

export { fetchShows };
export default reducer;
