import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { filterOutUnsupportedEntityTypes, getUserSlug } from '../../../utils';

const fetchRatings = createAsyncThunk(
  'app/ratings/fetch',
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(`/trakt/users/${getUserSlug()}/ratings`);
      return filterOutUnsupportedEntityTypes(response.data);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchRatings.fulfilled](state, action) {
      return action.payload;
    },
  },
  initialState: [],
  name: 'app/ratings',
  reducers: {},
});

export { fetchRatings };
export default reducer;
