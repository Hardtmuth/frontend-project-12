import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const token = JSON.parse(localStorage.getItem('userId')).token
    if (!token) {
      throw new Error('Токен не найден')
    }
    const response = await axios.get(routes.channelsPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
)

export const addChannel = createAsyncThunk( // FIX Unauthorized
  'channels/addChannel',
  async (newChannel) => {
    const token = JSON.parse(localStorage.getItem('userId')).token
    console.log('TOKEN is: ', token)
    if (!token) {
      throw new Error('Токен не найден')
    }
    const response = await axios.get(routes.channelsPath(), newChannel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
)

const channelsAdapter = createEntityAdapter()

const initialState = channelsAdapter.getInitialState({
  activeChannel: { id: '1', name: 'general' },
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
})

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChanel: channelsAdapter.addOne,
    removeChanel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload)
    },
    updateChannel: channelsAdapter.updateOne,
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      })
      /* .addCase(addChannel.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        channelsAdapter.setAll(state, action.payload)
        state.status = 'succeeded'
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      }) */
  },
})

export const selectors = channelsAdapter.getSelectors(state => state.channels)
export const { addChanel, removeChanel, updateChannel, setActiveChannel } = channelsSlice.actions
export default channelsSlice.reducer
