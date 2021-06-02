import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS } from '../../../utils';

const fetchMovies = createAsyncThunk(
  'movies/fetch',
  async function (
    { category, limit = DEFAULTS.PAGE_SIZE, page = 1 },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/movies/${category}?page=${page}&limit=${limit}&extended=full`,
      );
      if (category === 'popular') {
        response.data = response.data.map((item) => ({ movie: item }));
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
    [fetchMovies.fulfilled](state, action) {
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
  name: 'movies',
  reducers: {},
});

export { fetchMovies };
export default reducer;
