import { configureStore } from '@reduxjs/toolkit'
import mainSlice from './mainPageSlice.js'

export default configureStore({
  reducer: {
    // Свойство counter будет внутри объекта общего состояния: state.counter
    main: mainSlice,
  },
})