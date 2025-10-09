import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  activeChannel: { id: 1, name: 'general'},
  list: []
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      return {
        ...state,
        list: [ ...action.payload ]
      }
    },
    setActiveChannel: (state, action) => {
      return {
        ...state,
        activeChannel: action.payload
      }
    }
  },
})

export const { setChannels, setActiveChannel } = channelsSlice.actions
export default channelsSlice.reducer