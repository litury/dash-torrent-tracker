import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import './main.css'

import { Layout } from './shared/components/Layout'
import { HomePage, AddTorrentPage } from './config/routes'

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="add" element={<AddTorrentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster position="bottom-right" richColors />
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
