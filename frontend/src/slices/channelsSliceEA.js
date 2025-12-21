import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
  'channelsEA/fetchChannels',
  async () => {
    const token = JSON.parse(localStorage.getItem('userId')).token

    if (!token) {
      throw new Error('Токен не найден')
    }

    const response = await axios.get('api/v1/channels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('RESPONSE IS: ', response.data)
    return response.data
  },
)

export const addChannel = createAsyncThunk(
  'channelsEA/addChanel',
  async (newChannel) => {
    const response = await axios.post('/channels', newChannel)
    return response.data
  },
)

const channelsAdapter = createEntityAdapter()

const initialState = channelsAdapter.getInitialState({
  activeChannel: { id: 1, name: 'general' },
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
})

const channelsSliceEA = createSlice({
  name: 'channelsEA',
  initialState,
  reducers: {
    addChanel: channelsAdapter.addOne,
    addChanels: channelsAdapter.addMany,
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
  },
})

export const selectors = channelsAdapter.getSelectors(state => state.channelsEA)

export const { addChanel, addChanels, removeChanel, updateChannel } = channelsSliceEA.actions
// export const selectUsersStatus = (state) => state.users.status
// export const selectUsersError = (state) => state.users.error

export default channelsSliceEA.reducer

/*
Кроме selectAll(state), мы получаем:

selectIds(state) – возвращает ids
selectEntities(state) – возвращает entities
selectTotal(state) – возвращает общее количество
selectById(state, id) – возвращает конкретную сущность или undefined, если ничего не найдено
*/
