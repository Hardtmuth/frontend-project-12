import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './i18next.js'

import App from './components/App.jsx'
import store from './slices/index.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
