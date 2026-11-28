// ============================================================
// COMPONENTE RAÍZ
// ============================================================
// Monta el enrutador, el proveedor de autenticación y las
// notificaciones (toasts) de Sonner.

import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/router'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider debe envolver las rutas para que useAuth
          funcione en cualquier pantalla. */}
      <AuthProvider>
        <AppRoutes />

        {/* Notificaciones de éxito/error en la esquina superior. */}
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  )
}
