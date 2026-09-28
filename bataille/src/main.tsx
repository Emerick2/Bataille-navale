// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import AuthPlayerBridge from './context/AuthPlayerBridge'
import { PlayerProvider } from './context/PlayerContext'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <AuthProvider>
          <AuthPlayerBridge />
            <App />
        </AuthProvider>
      </PlayerProvider>
    </BrowserRouter>
  // </StrictMode>,
)
