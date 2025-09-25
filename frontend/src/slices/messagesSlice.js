import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  // Редьюсеры в слайсах меняют состояние и ничего не возвращают
  reducers: {
    setMessages: (state, action) => {
      const newState = action.payload
      state.push(...newState)
    }
  },
})

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { setMessages } = messagesSlice.actions

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default messagesSlice.reducer