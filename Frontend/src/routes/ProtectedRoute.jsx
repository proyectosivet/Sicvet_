// ============================================================
// RUTA PROTEGIDA
// ============================================================
// Envuelve las rutas privadas. Mientras se verifica la sesión
// muestra un spinner; si no hay usuario, redirige al login
// recordando la ruta que se intentó abrir.

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import Spinner from '../components/ui/Spinner'

export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth()
  const location = useLocation()

  // Esperamos a que AuthProvider valide el token guardado.
  if (cargando) {
    return (
      <Spinner
        pantallaCompleta
        mensaje="Verificando sesión..."
      />
    )
  }

  // Sin sesión: al login. Guardamos el destino para volver después.
  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: location.pathname }}
      />
    )
  }

  // Con sesión: renderiza la ruta hija (AppLayout y la página).
  return <Outlet />
}
