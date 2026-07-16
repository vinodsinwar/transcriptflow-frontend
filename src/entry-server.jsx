import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import TranslatePage from './pages/TranslatePage.jsx'
import DownloadPage from './pages/DownloadPage.jsx'

const pages = {
  'index.html': App,
  'translate-youtube-transcript.html': TranslatePage,
  'download-youtube-subtitles.html': DownloadPage,
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
