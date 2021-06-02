import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { getUserSlug } from '../../utils';
import { fetchLists } from '../app/lists/lists.slice';

const addToList = createAsyncThunk(
  'actions/list/add',
  async function ({ entity, listSlug, slug }, { rejectWithValue }) {
    try {
      await axios.post(
        `/trakt/users/${getUserSlug()}/lists/${listSlug}/items`,
        {
          [entity]: [{ ids: { slug } }],
        },
      );
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

const removeFromList = createAsyncThunk(
  'actions/list/remove',
  async function ({ entity, listSlug, slug }, { rejectWithValue }) {
    try {
      await axios.post(
        `/trakt/users/${getUserSlug()}/lists/${listSlug}/items/remove`,
        {
          [entity]: [{ ids: { slug } }],
        },
      );
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  },
);

function addToListAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(addToList(params));
    await dispatch(fetchLists());
  };
}

function removeFromListAndRefetch(params) {
  return async function (dispatch) {
    await dispatch(removeFromList(params));
    await dispatch(fetchLists());
  };
}

export {
  addToList,
  addToListAndRefetch,
  removeFromList,
  removeFromListAndRefetch,
};
