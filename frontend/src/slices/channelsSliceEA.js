import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, thunkAPI) => {
    const response = await axios.get('/channels');
    return response.data;
  }
);

export const addChannel = createAsyncThunk(
  'channels/addChanels',
  async (newChannel, thunkAPI) => {
    const response = await axios.post('/channels', newChannel);
    return response.data;
  }
);

const channelsAdapter = createEntityAdapter()

const initialState = channelsAdapter.getInitialState({
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
})

const channelsSliceEA = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChanel: channelsAdapter.addOne,
    addChanels: channelsAdapter.addMany,
    removeChanel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload)
    },
    updateChannel: channelsAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addChanels.fulfilled, (state, action) => {
        channelsAdapter.addOne(state, action.payload);
      })
  },
})

export const selectors = channelsAdapter.getSelectors(state => state.channels)

export const { addChanel, addChanels, removeChanel, updateChannel } = channelsSlice.actions
export const selectUsersStatus = (state) => state.users.status
export const selectUsersError = (state) => state.users.error

export default channelsSliceEA.reducer

/*
Кроме selectAll(state), мы получаем:

selectIds(state) – возвращает ids
selectEntities(state) – возвращает entities
selectTotal(state) – возвращает общее количество
selectById(state, id) – возвращает конкретную сущность или undefined, если ничего не найдено
*/