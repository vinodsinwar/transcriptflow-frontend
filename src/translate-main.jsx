import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import TranslatePage from './pages/TranslatePage.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <TranslatePage />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
