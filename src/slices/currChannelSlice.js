/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const currChannelAdapter = createEntityAdapter();

const initialState = currChannelAdapter.getInitialState();

const currChannelSlice = createSlice({
  name: 'currChannel',
  initialState,
  reducers: {
    setCurrChannel: currChannelAdapter.setOne,
    updateCurrChannel: currChannelAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.addChannel, (state, action) => {
      const channel = action.payload;
      currChannelAdapter.removeAll(state);
      currChannelAdapter.setOne(state, channel);
    });
  },
});

export const { actions } = currChannelSlice;
export const selectors = currChannelAdapter.getSelectors((state) => state.currChannel);
export default currChannelSlice.reducer;