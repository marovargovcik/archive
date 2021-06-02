import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { fetchRecommendations } from '../app/recommendations/recommendations.slice';

const postRecommendation = createAsyncThunk(
  'actions/recommendations/recommend',
  async function ({ entity, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/recommendations', {
        [entity]: [{ ids: { slug } }],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeRecommendation = createAsyncThunk(
  'actions/recommendations/unrecommend',
  async function ({ entity, slug }, { rejectWithValue }) {
    try {
      await axios.post('/trakt/sync/recommendations/remove', {
        [entity]: [{ ids: { slug } }],
      });
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

function postRecommendationAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(postRecommendation(params));
    await dispatch(fetchRecommendations());
  };
}

function removeRecommendationAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(removeRecommendation(params));
    await dispatch(fetchRecommendations());
  };
}

export {
  postRecommendation,
  postRecommendationAndRefetch,
  removeRecommendation,
  removeRecommendationAndRefetch,
};
