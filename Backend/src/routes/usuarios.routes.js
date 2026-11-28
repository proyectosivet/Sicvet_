// ============================================================
// RUTAS DE USUARIOS
// ============================================================
// Prefijo: /api/usuarios
// Todas las rutas son exclusivas del administrador.

import { Router } from 'express'
import {
  actualizarUsuario,
  cambiarEstadoUsuario,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
} from '../controllers/usuarios.controller.js'
import { autorizarRoles } from '../middlewares/autorizarRoles.js'
import { verificarToken } from '../middlewares/verificarToken.js'
import { ROLES } from '../config/constantes.js'

const router = Router()

// Aplicamos autenticación y autorización a todo el enrutador.
router.use(verificarToken, autorizarRoles(ROLES.ADMINISTRADOR))

// GET /api/usuarios
router.get('/', listarUsuarios)

// POST /api/usuarios
router.post('/', crearUsuario)

// PUT /api/usuarios/:id
router.put('/:id', actualizarUsuario)

// PATCH /api/usuarios/:id/estado
router.patch('/:id/estado', cambiarEstadoUsuario)

// DELETE /api/usuarios/:id (baja lógica)
router.delete('/:id', eliminarUsuario)

export default router
