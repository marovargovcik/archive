import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS, filterOutUnsupportedEntityTypes } from '../../../../utils';

const fetchList = createAsyncThunk(
  'users/list/fetch',
  async function ({ id, userSlug }, { rejectWithValue }) {
    try {
      const response = await axios.get(`/trakt/users/${userSlug}/lists/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const fetchListItems = createAsyncThunk(
  'users/list/items/fetch',
  async function (
    { id, limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, userSlug },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/users/${userSlug}/lists/${id}/items?extended=full&page=${page}&limit=${limit}`,
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

function fetchListAndItems(params) {
  return async function (dispatch) {
    await Promise.all([
      dispatch(fetchList(params)),
      dispatch(fetchListItems(params)),
    ]);
  };
}

const { reducer } = createSlice({
  extraReducers: {
    [fetchList.fulfilled](state, action) {
      state.summary = action.payload;
    },
    [fetchListItems.fulfilled](state, action) {
      state.items.entities = action.payload.entities;
      state.items.pagination.total = action.payload.total;
    },
  },
  initialState: {
    items: {
      entities: [],
      pagination: {
        total: 0,
      },
    },
    summary: null,
  },
  name: 'list',
  reducers: {},
});

export default reducer;
export { fetchList, fetchListAndItems, fetchListItems };
