import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { removeComment, updateComment } from '../../actions/comments';

const fetchShow = createAsyncThunk(
  'show/fetch',
  async function (slug, { rejectWithValue }) {
    try {
      const [
        summaryResponse,
        commentsResponse,
        peopleResponse,
        ratingsResponse,
        relatedResponse,
        statsResponse,
        seasonsResponse,
      ] = await Promise.all([
        axios.get(`/trakt/shows/${slug}?extended=full`),
        axios.get(`/trakt/shows/${slug}/comments/highest`),
        axios.get(`/trakt/shows/${slug}/people`),
        axios.get(`/trakt/shows/${slug}/ratings`),
        axios.get(`/trakt/shows/${slug}/related?extended=full`),
        axios.get(`/trakt/shows/${slug}/stats`),
        axios.get(`/trakt/shows/${slug}/seasons?extended=episodes`),
      ]);
      return {
        comments: commentsResponse.data,
        people: peopleResponse.data,
        ratings: ratingsResponse.data,
        related: relatedResponse.data,
        seasons: seasonsResponse.data.reverse(),
        stats: statsResponse.data,
        summary: summaryResponse.data,
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchShow.fulfilled](state, action) {
      return action.payload;
    },
    [removeComment.fulfilled](state, action) {
      const { arg: id } = action.meta;
      const index = state.comments.findIndex((comment) => comment.id === id);
      if (index !== -1) {
        state.comments.splice(index, 1);
      }
    },
    [updateComment.fulfilled](state, action) {
      const index = state.comments.findIndex(
        (comment) => comment.id === action.payload.id,
      );
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
  },
  initialState: {
    comments: [],
    people: null,
    ratings: null,
    related: [],
    seasons: [],
    stats: null,
    summary: null,
  },
  name: 'show',
  reducers: {},
});

export { fetchShow };
export default reducer;
