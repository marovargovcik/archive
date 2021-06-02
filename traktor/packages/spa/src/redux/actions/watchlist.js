import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { fetchWatchlist } from '../app/watchlist/watchlist.slice';

const addToWatchlist = createAsyncThunk(
  'actions/watchlist/add',
  async function ({ entity, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/watchlist', {
        [entity]: [{ ids: { slug } }],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeFromWatchlist = createAsyncThunk(
  'actions/watchlist/remove',
  async function ({ entity, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/watchlist/remove', {
        [entity]: [{ ids: { slug } }],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

function addToWatchlistAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(addToWatchlist(params));
    await dispatch(fetchWatchlist());
  };
}

function removeFromWatchlistAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(removeFromWatchlist(params));
    await dispatch(fetchWatchlist());
  };
}

export {
  addToWatchlist,
  addToWatchlistAndRefetch,
  removeFromWatchlist,
  removeFromWatchlistAndRefetch,
};
