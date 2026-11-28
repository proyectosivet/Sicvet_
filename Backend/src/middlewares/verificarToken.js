// ============================================================
// MIDDLEWARE: VERIFICAR TOKEN JWT
// ============================================================
// Se ejecuta antes de las rutas protegidas. Comprueba que la
// petición traiga un token válido y guarda sus datos en req.usuario
// para que los controladores sepan quién está autenticado.
//
// Además consulta al almacén para confirmar que el usuario sigue
// existiendo y activo. Así, si un administrador desactiva una
// cuenta, su token deja de servir de inmediato.

import jwt from 'jsonwebtoken'
import {
  ESTADOS_USUARIO,
  JWT_ALGORITMO,
} from '../config/constantes.js'
import { buscarUsuarioPorId } from '../utils/almacen.js'
import { responderError } from '../utils/respuestas.js'

export function verificarToken(req, res, next) {
  // 1. El token debe venir en el encabezado:
  //    Authorization: Bearer <token>
  const autorizacion = req.headers.authorization

  if (!autorizacion?.startsWith('Bearer ')) {
    return responderError(res, 'No se proporcionó un token', 401)
  }

  // 2. Separamos el token del prefijo "Bearer".
  const token = autorizacion.slice('Bearer '.length).trim()

  if (!token) {
    return responderError(res, 'Token no proporcionado', 401)
  }

  try {
    // 3. verify comprueba la firma, la expiración y el algoritmo.
    //    Si algo falla, lanza una excepción que capturamos abajo.
    const datos = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [JWT_ALGORITMO],
    })

    // 4. Confirmamos que el usuario siga existiendo y activo.
    const usuario = buscarUsuarioPorId(datos.sub)

    if (!usuario || usuario.estado !== ESTADOS_USUARIO.ACTIVO) {
      return responderError(
        res,
        'La sesión ya no es válida. Inicia sesión de nuevo.',
        401,
      )
    }

    // 5. Guardamos datos frescos del usuario. Usamos el rol actual
    //    del almacén, no el del token, para que los cambios de rol
    //    se apliquen sin esperar a que expire el JWT.
    req.usuario = {
      ...datos,
      sub: String(usuario.id),
      rol: usuario.rol,
      nombre: usuario.nombre,
      correo: usuario.correo,
    }

    // 6. Continuamos con el controlador de la ruta.
    return next()
  } catch {
    // No mostramos el detalle técnico para no filtrar información.
    return responderError(res, 'Token inválido o expirado', 401)
  }
}
