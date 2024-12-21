import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react' 

const script = document.createElement('script');
script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_CLIENT_ID}&vault=true`;
script.async = true;
document.body.appendChild(script);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-right' } }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
)
