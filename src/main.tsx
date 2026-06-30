import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { ConfirmDialogProvider } from './components/ConfirmDialog.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <ConfirmDialogProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.875rem',
            background: '#fff',
            color: '#000',
            border: '1px solid #e0e0e0',
            borderRadius: '2px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            padding: '14px 18px',
          },
          success: {
            iconTheme: { primary: '#c5a059', secondary: '#fff' },
            style: { borderLeft: '4px solid #c5a059' },
          },
          error: {
            iconTheme: { primary: '#c0392b', secondary: '#fff' },
            style: { borderLeft: '4px solid #c0392b' },
          },
        }}
      />
    </ConfirmDialogProvider>
  </StrictMode>
  </BrowserRouter>
)
