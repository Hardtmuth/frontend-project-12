import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const messagesAdapter = createEntityAdapter()

const initialState = messagesAdapter.getInitialState()

const messagesSliceEA = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessage: (state, { payload }) => {
      messagesAdapter.removeOne(state, payload)
    },
    updateMessage: messagesAdapter.updateOne,
  },
})

export const selectors = messagesAdapter.getSelectors(state => state.messages)

export const { addMessage, addMessages, removeMessage, updateMessage } = messagesSlice.actions
export default messagesSliceEA.reducer