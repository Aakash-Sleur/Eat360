import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { QueryProvider } from './lib/react-query/query-provider.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import AuthProvider from './context/auth-store.tsx'
import ModalProvider from './components/modal-provider.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <ModalProvider />
            <App />
          </ThemeProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
)
