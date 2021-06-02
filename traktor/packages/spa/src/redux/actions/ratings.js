import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { fetchRatings } from '../app/ratings/ratings.slice';

const postRating = createAsyncThunk(
  'actions/ratings/rate',
  async function ({ entity, rating, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/ratings', {
        [entity]: [
          {
            ids: { slug },
            rating,
          },
        ],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeRating = createAsyncThunk(
  'actions/ratings/remove',
  async function ({ entity, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/ratings/remove', {
        [entity]: [{ ids: { slug } }],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

function postRatingAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(postRating(params));
    await dispatch(fetchRatings());
  };
}

function removeRatingAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(removeRating(params));
    await dispatch(fetchRatings());
  };
}

export {
  postRating,
  postRatingAndRefetch,
  removeRating,
  removeRatingAndRefetch,
};
