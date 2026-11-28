// ============================================================
// API DEL DASHBOARD
// ============================================================
// Encapsula la llamada al resumen para que la pantalla no se
// preocupe por construir la URL ni por el formato de respuesta.

import { api } from '../../lib/api'

// Obtiene el resumen. Los filtros son opcionales; si no se envían,
// el backend usa el mes actual hasta hoy.
export function obtenerResumen({ desde, hasta } = {}) {
  const parametros = new URLSearchParams()

  if (desde) parametros.set('desde', desde)
  if (hasta) parametros.set('hasta', hasta)

  const consulta = parametros.toString()

  return api.get(
    `/dashboard/resumen${consulta ? `?${consulta}` : ''}`,
  )
}
