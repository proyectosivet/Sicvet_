// ============================================================
// MIDDLEWARE: AUTORIZAR POR ROL
// ============================================================
// Se usa después de verificarToken. Comprueba que el rol del
// usuario esté dentro de los roles permitidos para la ruta.
//
// Ejemplo:
//   router.get('/', verificarToken, autorizarRoles('administrador'), ...)

import { responderError } from '../utils/respuestas.js'

export function autorizarRoles(...rolesPermitidos) {
  return function (req, res, next) {
    // Si no hay usuario, faltó ejecutar verificarToken antes.
    if (!req.usuario) {
      return responderError(res, 'No autenticado', 401)
    }

    // El rol viene firmado dentro del JWT, no del body, así que el
    // cliente no puede falsificarlo.
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return responderError(
        res,
        'No tienes permisos para realizar esta acción',
        403,
      )
    }

    return next()
  }
}
