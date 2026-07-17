import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import PricingPage from './pages/PricingPage.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <PricingPage />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
