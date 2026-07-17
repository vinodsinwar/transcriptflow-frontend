import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import TranslatePage from './pages/TranslatePage.jsx'
import DownloadPage from './pages/DownloadPage.jsx'
import PlaylistPage from './pages/PlaylistPage.jsx'
import PricingPage from './pages/PricingPage.jsx'

const pages = {
  'index.html': App,
  'translate-youtube-transcript.html': TranslatePage,
  'download-youtube-subtitles.html': DownloadPage,
  'youtube-playlist-transcript.html': PlaylistPage,
  'pricing.html': PricingPage,
}

export function render(pageFile) {
  const Page = pages[pageFile]
  if (!Page) throw new Error(`Unknown page: ${pageFile}`)
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>
  )
}

export const pageFiles = Object.keys(pages)
