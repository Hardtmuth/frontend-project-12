import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = []

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  // Редьюсеры в слайсах меняют состояние и ничего не возвращают
  reducers: {
    setChannels: (state, action) => {
      const newState = action.payload
      state.push(...newState)
    }
  },
})

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { setChannels } = channelsSlice.actions

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default channelsSlice.reducer