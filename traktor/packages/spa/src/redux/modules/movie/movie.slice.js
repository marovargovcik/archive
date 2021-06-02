import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { removeComment, updateComment } from '../../actions/comments';

const fetchMovie = createAsyncThunk(
  'movie/fetch',
  async function (slug, { rejectWithValue }) {
    try {
      const [
        statsResponse,
        summaryResponse,
        commentsResponse,
        peopleResponse,
        ratingsResponse,
        relatedResponse,
      ] = await Promise.all([
        axios.get(`/trakt/movies/${slug}/stats`),
        axios.get(`/trakt/movies/${slug}?extended=full`),
        axios.get(`/trakt/movies/${slug}/comments/highest`),
        axios.get(`/trakt/movies/${slug}/people`),
        axios.get(`/trakt/movies/${slug}/ratings`),
        axios.get(`/trakt/movies/${slug}/related?extended=full`),
      ]);
      return {
        comments: commentsResponse.data,
        people: peopleResponse.data,
        ratings: ratingsResponse.data,
        related: relatedResponse.data,
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
    [fetchMovie.fulfilled](state, action) {
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
    stats: null,
    summary: null,
  },
  name: 'movie',
  reducers: {},
});

export { fetchMovie };
export default reducer;
