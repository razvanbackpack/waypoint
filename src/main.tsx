import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import { router } from './router'
import { GameDataProvider } from './contexts/GameDataContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GameDataProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" richColors theme="dark" />
      </GameDataProvider>
    </QueryClientProvider>
  </StrictMode>,
)
