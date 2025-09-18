import { StrictMode } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.jsx'
import store from './slices/index.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
