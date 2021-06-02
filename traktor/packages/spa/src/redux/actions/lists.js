import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { getUserSlug } from '../../utils';

const addList = createAsyncThunk(
  'actions/lists/add',
  async function (list, { rejectWithValue }) {
    try {
      const response = await axios.post(
        `/trakt/users/${getUserSlug()}/lists`,
        list,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeList = createAsyncThunk(
  'actions/lists/remove',
  async function (slug, { rejectWithValue }) {
    try {
      await axios.delete(`/trakt/users/${getUserSlug()}/lists/${slug}`);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const updateList = createAsyncThunk(
  'actions/lists/update',
  async function ({ description, name, privacy, slug }, { rejectWithValue }) {
    try {
      const response = await axios.put(
        `/trakt/users/${getUserSlug()}/lists/${slug}`,
        { description, name, privacy, slug },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

export { addList, removeList, updateList };
