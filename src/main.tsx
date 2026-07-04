import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/dotgothic16'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// オフライン対応(本番ビルドのみ)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('./sw.js').catch(() => {})
}
