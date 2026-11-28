// ============================================================
// MIDDLEWARE: RUTA NO ENCONTRADA (404)
// ============================================================
// Se registra al final de todas las rutas. Si ninguna coincidió,
// responde con un JSON uniforme en lugar del HTML de Express.

import { responderError } from '../utils/respuestas.js'

export function noEncontrado(req, res) {
  return responderError(
    res,
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    404,
  )
}
