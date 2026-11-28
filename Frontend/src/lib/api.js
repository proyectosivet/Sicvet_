// ============================================================
// CLIENTE HTTP DE LA API
// ============================================================
// Envuelve fetch para:
//   - Agregar la URL base.
//   - Enviar el token JWT en cada petición.
//   - Convertir las respuestas de error en excepciones claras.
//   - Cerrar la sesión automáticamente ante un 401.

import { API_URL, EVENTO_SESION_EXPIRADA } from './constants'
import { limpiarSesion, obtenerToken } from './sesion'

// Error personalizado para que las pantallas puedan mostrar
// "error.mensaje" sin revisar la respuesta HTTP.
export class ErrorApi extends Error {
  constructor(mensaje, estado = 0, detalles = undefined) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.estado = estado
    this.detalles = detalles
  }
}

// ------------------------------------------------------------
// Función central de peticiones
// ------------------------------------------------------------
async function solicitar(ruta, opciones = {}) {
  const { metodo = 'GET', cuerpo, headers = {} } = opciones

  const token = obtenerToken()

  const configuracion = {
    method: metodo,
    headers: {
      // Solo enviamos Content-Type si hay cuerpo JSON.
      ...(cuerpo !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),
      // Si hay token, lo adjuntamos como Bearer.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (cuerpo !== undefined) {
    configuracion.body = JSON.stringify(cuerpo)
  }

  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, configuracion)
  } catch {
    // Error de red: servidor apagado, URL incorrecta, CORS, etc.
    throw new ErrorApi(
      'No se pudo conectar con el servidor. Verifica que el backend esté encendido.',
      0,
    )
  }

  // Intentamos leer siempre JSON; si el servidor devuelve algo
  // distinto, evitamos que la aplicación se rompa.
  let datos = null

  try {
    datos = await respuesta.json()
  } catch {
    // El cuerpo no era JSON (por ejemplo, un error de red del proxy).
    // Mantenemos datos en null y usamos el mensaje genérico.
  }

  if (!respuesta.ok) {
    // Un 401 con token significa que la sesión ya no es válida:
    // borramos los datos locales y avisamos a AuthProvider.
    if (respuesta.status === 401 && token) {
      limpiarSesion()
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }

    throw new ErrorApi(
      datos?.mensaje || 'Ocurrió un error al comunicarse con el servidor',
      respuesta.status,
      datos?.detalles,
    )
  }

  return datos
}

// ------------------------------------------------------------
// Métodos de conveniencia
// ------------------------------------------------------------
export const api = {
  get: (ruta) => solicitar(ruta),

  post: (ruta, cuerpo) => solicitar(ruta, { metodo: 'POST', cuerpo }),

  put: (ruta, cuerpo) => solicitar(ruta, { metodo: 'PUT', cuerpo }),

  patch: (ruta, cuerpo) => solicitar(ruta, { metodo: 'PATCH', cuerpo }),

  eliminar: (ruta) => solicitar(ruta, { metodo: 'DELETE' }),
}
