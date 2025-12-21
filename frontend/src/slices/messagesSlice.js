import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import routes from '../routes.js'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
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

export const addMessage = createAsyncThunk(
  'messages/addMessage',
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

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addM: messagesAdapter.addOne,
  },
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
      .addCase(addMessage.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        messagesAdapter.addOne(state, action.payload)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      })
  },
})

export const { addM } = messagesSlice.actions
export const messagesSelectors = messagesAdapter.getSelectors(state => state.messages)
export default messagesSlice.reducer
