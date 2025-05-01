import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import App from './App.tsx'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <CookiesProvider>
              <App />
          </CookiesProvider>
      </BrowserRouter>
  </StrictMode>,
)
