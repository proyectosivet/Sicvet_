// ============================================================
// RUTAS DE SERVICIOS
// ============================================================
// Prefijo: /api/servicios
// Consulta: cualquier usuario autenticado.
// Escritura: solo administrador.

import { Router } from 'express'
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
} from '../controllers/servicios.controller.js'
import { autorizarRoles } from '../middlewares/autorizarRoles.js'
import { verificarToken } from '../middlewares/verificarToken.js'
import { ROLES } from '../config/constantes.js'

const router = Router()

router.use(verificarToken)

// GET /api/servicios
router.get('/', listarServicios)

// POST /api/servicios
router.post('/', autorizarRoles(ROLES.ADMINISTRADOR), crearServicio)

// PUT /api/servicios/:id
router.put('/:id', autorizarRoles(ROLES.ADMINISTRADOR), actualizarServicio)

// DELETE /api/servicios/:id (baja lógica)
router.delete(
  '/:id',
  autorizarRoles(ROLES.ADMINISTRADOR),
  eliminarServicio,
)

export default router
