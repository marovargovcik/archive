import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { transformEntityToSingular } from '../../../utils';

const fetchFeed = createAsyncThunk(
  'app/feed/fetch',
  async function (_, { rejectWithValue }) {
    try {
      const response = await axios.get(`/api/feed`);
      const requests = response.data.map(({ entity, slug }) =>
        axios.get(`/trakt/${entity}/${slug}`),
      );
      const responses = await Promise.all(requests);
      return responses.map(({ data }, index) => {
        const type = transformEntityToSingular(response.data[index].entity);
        return {
          feed: response.data[index],
          type,
          [type]: data,
        };
      });
    } catch (err) {
      return rejectWithValue(err.toString());
    }
  },
);

const { reducer } = createSlice({
  extraReducers: {
    [fetchFeed.fulfilled](state, action) {
      return action.payload;
    },
  },
  initialState: [],
  name: 'app/feed',
  reducers: {},
});

export { fetchFeed };
export default reducer;
