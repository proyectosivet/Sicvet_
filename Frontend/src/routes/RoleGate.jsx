// ============================================================
// CONTROL DE ACCESO POR ROL
// ============================================================
// Se usa dentro de las rutas para mostrar una página 403 cuando el
// usuario no tiene el rol necesario. El backend también valida los
// permisos: esto solo mejora la experiencia de usuario.

import { useAuth } from '../context/auth-context'
import NoAutorizadoPage from '../features/errors/NoAutorizadoPage'

export default function RoleGate({ roles, children }) {
  const { usuario } = useAuth()

  // Sin usuario o con un rol no permitido, mostramos 403.
  if (!usuario || !roles.includes(usuario.rol)) {
    return <NoAutorizadoPage />
  }

  return children
}
