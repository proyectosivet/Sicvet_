// ============================================================
// API DEL PERFIL
// ============================================================
// La actualización de datos personales se hace a través de
// AuthContext (para refrescar la sesión). Aquí solo vive el cambio
// de contraseña, que no modifica el usuario visible.

import { api } from '../../lib/api'

export function cambiarPassword(datos) {
  return api.put('/auth/password', datos)
}
