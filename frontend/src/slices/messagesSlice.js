import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// Начальное значение
const initialState = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const newState = action.payload
      state.push(...newState)
    },
    sendMessage: () => {
      const newMessage = { body: 'sdas', channelId: '1', username: 'admin' }
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1ODEyNzY1NX0.roxPw8yrkOfY6H6kxCve5sBpOD-RL6yHYxUPEjWTy_4'

      axios.post('http://localhost:5002/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        console.log(response.data); // => { id: '1', body: 'new message', channelId: '1', username: 'admin }
      })
    },
  },
})

export const { setMessages, sendMessage } = messagesSlice.actions
export default messagesSlice.reducer