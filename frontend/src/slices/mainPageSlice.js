import { createSlice } from '@reduxjs/toolkit'

// Начальное значение
const initialState = {
  data: '',
}

const mainSlice = createSlice({
  name: 'mainStore',
  initialState,
  // Редьюсеры в слайсах меняют состояние и ничего не возвращают
  reducers: {
    setData: (state, action) => {
      state.data += JSON.stringify(action.payload)
    }
  },
})

// Слайс генерирует действия, которые экспортируются отдельно
// Действия генерируются автоматически из имен ключей редьюсеров
export const { setData } = mainSlice.actions

// По умолчанию экспортируется редьюсер, сгенерированный слайсом
export default mainSlice.reducer