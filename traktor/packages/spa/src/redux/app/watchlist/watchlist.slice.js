import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { filterOutUnsupportedEntityTypes, getUserSlug } from '../../../utils';

const fetchWatchlist = createAsyncThunk(
  'app/watchlist/fetch',
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(
        `/trakt/users/${getUserSlug()}/watchlist?extended=full`,
      );
      return filterOutUnsupportedEntityTypes(response.data);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchWatchlist.fulfilled](state, action) {
      return action.payload;
    },
  },
  initialState: [],
  name: 'app/watchlist',
  reducers: {},
});

export { fetchWatchlist };
export default reducer;
