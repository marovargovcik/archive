import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { transformEntityToSingular } from '../../utils';

const postComment = createAsyncThunk(
  'actions/comments/post',
  async function (
    { comment, entity, slug, spoiler = false },
    { rejectWithValue },
  ) {
    entity = transformEntityToSingular(entity);
    try {
      const response = await axios.post('/trakt/comments', {
        comment,
        [entity]: { ids: { slug } },
        spoiler,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeComment = createAsyncThunk(
  'actions/comments/remove',
  async function (id, { rejectWithValue }) {
    try {
      await axios.delete(`/trakt/comments/${id}`);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const updateComment = createAsyncThunk(
  'actions/comments/update',
  async function ({ comment, id, spoiler }, { rejectWithValue }) {
    try {
      const response = await axios.put(`/trakt/comments/${id}`, {
        comment,
        spoiler,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export { postComment, removeComment, updateComment };
