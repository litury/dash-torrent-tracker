import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import './main.css'

import { Layout } from './shared/components/Layout'
import { HomePage, TorrentPage } from './config/routes'

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="torrent/:id" element={<TorrentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
  </>
)

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
