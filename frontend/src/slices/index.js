import { configureStore } from '@reduxjs/toolkit'
import channelsSlice from './channelsSlice.js'
import messagesSlice from './messagesSlice.js'
import messagesSliceEA from './messagesSliceEA.js'

export default configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
    messagesEA: messagesSliceEA,
  },
})
