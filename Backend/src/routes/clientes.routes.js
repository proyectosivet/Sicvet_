// ============================================================
// RUTAS DE CLIENTES
// ============================================================
// Prefijo: /api/clientes
// Lectura: administrador, recepcionista y veterinario.
// Escritura: administrador y recepcionista.

import { Router } from 'express'
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  listarClientes,
  obtenerCliente,
} from '../controllers/clientes.controller.js'
import { autorizarRoles } from '../middlewares/autorizarRoles.js'
import { verificarToken } from '../middlewares/verificarToken.js'
import { ROLES } from '../config/constantes.js'

const router = Router()

// Todas las rutas requieren sesión.
router.use(verificarToken)

// GET /api/clientes
router.get(
  '/',
  autorizarRoles(
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
    ROLES.VETERINARIO,
  ),
  listarClientes,
)

// GET /api/clientes/:id
router.get(
  '/:id',
  autorizarRoles(
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
    ROLES.VETERINARIO,
  ),
  obtenerCliente,
)

// POST /api/clientes
router.post(
  '/',
  autorizarRoles(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA),
  crearCliente,
)

// PUT /api/clientes/:id
router.put(
  '/:id',
  autorizarRoles(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA),
  actualizarCliente,
)

// DELETE /api/clientes/:id
router.delete(
  '/:id',
  autorizarRoles(ROLES.ADMINISTRADOR, ROLES.RECEPCIONISTA),
  eliminarCliente,
)

export default router
