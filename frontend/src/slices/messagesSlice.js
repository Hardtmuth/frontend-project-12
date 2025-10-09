import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Начальное значение
const initialState = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    getMessages: (state, action) => {
      const newState = action.payload
      state.push(...newState)
    },
    sendMessage: (state, action) => {
      const { body, channelId, username, token } = action.payload
      const message = { body, channelId, username }

      axios.post('http://localhost:5002/api/v1/messages', message, { /* TODO rewrite PATH */
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log(response.data); // => { id: '1', body: 'new message', channelId: '1', username: 'admin }
      })
    },
  },
})

export const { getMessages, sendMessage } = messagesSlice.actions
export default messagesSlice.reducer