import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Navigator from './routes.jsx'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; 

import { BrowserRouter as Router, } from 'react-router-dom';
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <MantineProvider>
      <ModalsProvider>
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
        <Router>
          <Navigator />
        </Router>
      </ModalsProvider>
    </MantineProvider>
  </Provider>
  // </StrictMode>,
)
