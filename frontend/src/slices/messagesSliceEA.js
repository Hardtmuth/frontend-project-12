import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchMessages= createAsyncThunk(
  'messagesEA/fetchMessages',
  async () => {
    const token = JSON.parse(localStorage.getItem('userId')).token
    if (!token) {
      throw new Error('Токен не найден')
    }
    const response = await axios.get(routes.messagesPath(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
)

export const addMessageEA = createAsyncThunk(
  'messagesEA/addMessage',
  async (newMessage) => {
    const token = JSON.parse(localStorage.getItem('userId')).token
    if (!token) {
      throw new Error('Токен не найден')
    }
    const response = await axios.post(routes.messagesPath(), newMessage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
)

const messagesAdapter = createEntityAdapter()

const initialState = messagesAdapter.getInitialState({
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
})

const messagesSliceEA = createSlice({
  name: 'messagesEA',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        messagesAdapter.setAll(state, action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      })
      .addCase(addMessageEA.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addMessageEA.fulfilled, (state, action) => {
        messagesAdapter.addOne(state, action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(addMessageEA.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      })
  },
})


export const messagesSelectors = messagesAdapter.getSelectors(state => state.messagesEA)
export default messagesSliceEA.reducer
