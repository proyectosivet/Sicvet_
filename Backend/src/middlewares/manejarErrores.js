// ============================================================
// MIDDLEWARE: MANEJADOR GLOBAL DE ERRORES
// ============================================================
// Express lo reconoce porque tiene cuatro parámetros. Cualquier
// error no capturado por un controlador termina aquí, evitando que
// el servidor se caiga y devolviendo una respuesta JSON clara.

import { responderError } from '../utils/respuestas.js'

export function manejarErrores(error, req, res, next) {
  // Si las cabeceras ya se enviaron no podemos responder de nuevo;
  // delegamos en el manejador por defecto de Express.
  if (res.headersSent) {
    return next(error)
  }

  // Registramos el error en la consola del servidor para depuración.
  // En producción no se mostraría al cliente.
  console.error('[SICVET] Error no controlado:', error)

  return responderError(
    res,
    'Ocurrió un error interno en el servidor',
    500,
  )
}
