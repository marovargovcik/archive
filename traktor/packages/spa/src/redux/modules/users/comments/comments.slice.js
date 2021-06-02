import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULTS, filterOutUnsupportedEntityTypes } from '../../../../utils';
import { removeComment, updateComment } from '../../../actions/comments';

const fetchComments = createAsyncThunk(
  'users/comments/fetch',
  async function (
    { limit = DEFAULTS.ALTERNATE_PAGE_SIZE, page = 1, userSlug },
    { rejectWithValue },
  ) {
    try {
      const response = await axios.get(
        `/trakt/users/${userSlug}/comments/all/movies,shows?page=${page}&limit=${limit}`,
      );
      return {
        entities: filterOutUnsupportedEntityTypes(response.data),
        total: parseInt(response.headers['x-pagination-page-count']),
      };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchComments.fulfilled](state, action) {
      state.entities = action.payload.entities;
      state.pagination.total = action.payload.total;
    },
    [removeComment.fulfilled](state, action) {
      const { arg: id } = action.meta;
      const index = state.entities.findIndex(
        ({ comment }) => comment.id === id,
      );
      if (index !== -1) {
        state.entities.splice(index, 1);
      }
    },
    [updateComment.fulfilled](state, action) {
      const index = state.entities.findIndex(
        ({ comment }) => comment.id === action.payload.id,
      );
      if (index !== -1) {
        state.entities[index].comment = action.payload;
      }
    },
  },
  initialState: {
    entities: [],
    pagination: {
      total: 0,
    },
  },
  name: 'users/comments',
  reducers: {},
});

export { fetchComments };
export default reducer;
