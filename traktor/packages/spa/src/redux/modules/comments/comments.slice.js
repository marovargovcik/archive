import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS } from '../../../utils';
import {
  postComment,
  removeComment,
  updateComment,
} from '../../actions/comments';
import { fetchMovie } from '../movie/movie.slice';
import { fetchShow } from '../show/show.slice';

const fetchComments = createAsyncThunk(
  'comments/fetch',
  async function (
    { entity, limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, slug, sort },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/${entity}/${slug}/comments/${sort}?page=${page}&limit=${limit}`,
      );
      return {
        entities: response.data,
        total: parseInt(response.headers['x-pagination-page-count']),
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

function fetchEntityAndComments(params) {
  const { entity, slug } = params;
  const fn = entity === 'movies' ? fetchMovie : fetchShow;
  return async function (dispatch) {
    await Promise.all([dispatch(fn(slug)), dispatch(fetchComments(params))]);
  };
}

const { reducer } = createSlice({
  extraReducers: {
    [fetchComments.fulfilled](state, action) {
      state.entities = action.payload.entities;
      state.pagination.total = action.payload.total;
    },
    [postComment.fulfilled](state, action) {
      state.entities.unshift(action.payload);
    },
    [removeComment.fulfilled](state, action) {
      const { arg: id } = action.meta;
      const index = state.entities.findIndex((comment) => comment.id === id);
      if (index !== -1) {
        state.entities.splice(index, 1);
      }
    },
    [updateComment.fulfilled](state, action) {
      const index = state.entities.findIndex(
        (comment) => comment.id === action.payload.id,
      );
      if (index !== -1) {
        state.entities[index] = action.payload;
      }
    },
  },
  initialState: {
    entities: [],
    pagination: {
      total: 0,
    },
  },
  name: 'comments',
  reducers: {},
});

export { fetchComments, fetchEntityAndComments };
export default reducer;
