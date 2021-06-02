import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { fetchConnections } from '../app/connections/connections.slice';
import { fetchFeed } from '../app/feed/feed.slice';

const follow = createAsyncThunk(
  'actions/connections/follow',
  async function (userSlug, { rejectWithValue }) {
    try {
      await axios.post(`/api/users/${userSlug}/follow`);
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  },
);

const unfollow = createAsyncThunk(
  'actions/connections/unfollow',
  async function (userSlug, { rejectWithValue }) {
    try {
      await axios.delete(`/api/users/${userSlug}/unfollow`);
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  },
);

function followAndFetch(params) {
  return async function (dispatch) {
    await dispatch(follow(params));
    await dispatch(fetchConnections());
    await dispatch(fetchFeed());
  };
}

function unfollowAndFetch(params) {
  return async function (dispatch) {
    await dispatch(unfollow(params));
    await dispatch(fetchConnections());
    await dispatch(fetchFeed());
  };
}

export { follow, followAndFetch, unfollow, unfollowAndFetch };
