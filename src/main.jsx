import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login/login.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      
    <Login />
    </Provider>
  </StrictMode>,
)
