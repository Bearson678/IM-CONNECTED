import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import setupLocatorUI from "@locator/runtime";
import './index.css'
import App from './App.jsx'
setupLocatorUI()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
