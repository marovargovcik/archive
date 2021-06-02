import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS, transformEntityToSingular } from '../../../utils';

const fetchSearchResults = createAsyncThunk(
  'search/fetch',
  async function (
    { entity, limit = DEFAULTS.PAGE_SIZE, page = 1, query },
    { rejectWithValue },
  ) {
    try {
      entity = transformEntityToSingular(entity);
      const response = await axios.get(
        `/trakt/search/${entity}?query=${query}&page=${page}&limit=${limit}?extended=full`,
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
    [fetchSearchResults.fulfilled](state, action) {
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
  name: 'search',
  reducers: {},
});

export { fetchSearchResults };
export default reducer;
