import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="392705207882-qmru3mi3bp7hv675el1b5vm0eh4ob3a5.apps.googleusercontent.com">
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
