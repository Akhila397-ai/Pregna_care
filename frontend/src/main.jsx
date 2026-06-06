import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {  } from "@react-oauth/google";
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
console.log(import.meta.env.VITE_CLIENT_ID);
createRoot(document.getElementById('root')).render(
 <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>

  <Provider store={store}>
      <App />
  </Provider>

</GoogleOAuthProvider>
)
