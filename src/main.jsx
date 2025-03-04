import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './layouts/admin/contexts/LoadingContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoadingProvider> {/* Envuelve App con el LoadingProvider */}
      <App />
    </LoadingProvider>
  </BrowserRouter>
)
