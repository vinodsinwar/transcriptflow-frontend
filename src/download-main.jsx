import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import DownloadPage from './pages/DownloadPage.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <DownloadPage />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
