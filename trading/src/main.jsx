import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import ScrollToTop from "./frontend/components/ScrollToTop/ScrollToTop.jsx"
import { ThemeProvider } from "./frontend/components/ThemeContext.jsx"
import './frontend/theme.css'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ScrollToTop />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
