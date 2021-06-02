import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchConnections = createAsyncThunk(
  'users/connections/fetch',
  async function (userSlug, { rejectWithValue }) {
    try {
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`/api/users/${userSlug}/followers`),
        axios.get(`/api/users/${userSlug}/following`),
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
  name: 'users/connections',
  reducers: {},
});

export { fetchConnections };
export default reducer;
