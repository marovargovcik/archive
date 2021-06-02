import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { getUserSlug } from '../../../utils';

const fetchConnections = createAsyncThunk(
  'app/connections/fetch',
  async function (_, { rejectWithValue }) {
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`/api/users/${getUserSlug()}/followers`),
        axios.get(`/api/users/${getUserSlug()}/following`),
      ]);
      return {
        followers: followersResponse.data,
        following: followingResponse.data,
      };
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchConnections.fulfilled](state, action) {
      return action.payload;
    },
  },
  initialState: {
    followers: [],
    following: [],
  },
  name: 'app/connections',
  reducers: {},
});

export { fetchConnections };
export default reducer;
