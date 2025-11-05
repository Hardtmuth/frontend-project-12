import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  activeChannel: { id: 1, name: 'general' },
  list: [],
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.list = action.payload
      if (action.payload.length > 0) {
        state.activeChannel = action.payload[0]
      }
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload
    },
  },
})

export const { setChannels, setActiveChannel } = channelsSlice.actions
export default channelsSlice.reducer
