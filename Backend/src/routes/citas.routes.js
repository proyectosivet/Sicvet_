// ============================================================
// RUTAS DE CITAS
// ============================================================
// Prefijo: /api/citas
// IMPORTANTE: las rutas específicas (/mias, /agenda) deben ir
// antes de /:id; de lo contrario Express interpretaría "mias"
// como un ID.

import { Router } from 'express'
import {
  actualizarCita,
  cambiarEstadoCita,
  crearCita,
  eliminarCita,
  listarCitas,
  listarMisCitas,
  obtenerAgenda,
  obtenerCita,
} from '../controllers/citas.controller.js'
import { autorizarRoles } from '../middlewares/autorizarRoles.js'
import { verificarToken } from '../middlewares/verificarToken.js'
import { ROLES, ROLES_PERSONAL } from '../config/constantes.js'

const router = Router()

router.use(verificarToken)

// GET /api/citas
router.get('/', listarCitas)

// GET /api/citas/mias (cliente)
router.get('/mias', listarMisCitas)

// GET /api/citas/agenda (personal de la clínica)
router.get('/agenda', autorizarRoles(...ROLES_PERSONAL), obtenerAgenda)

// POST /api/citas (cliente o personal)
router.post('/', crearCita)

// GET /api/citas/:id
router.get('/:id', obtenerCita)

// PUT /api/citas/:id (reprogramar)
router.put('/:id', actualizarCita)

// PATCH /api/citas/:id/estado (confirmar, completar, cancelar)
router.patch('/:id/estado', cambiarEstadoCita)

// DELETE /api/citas/:id (solo administrador)
router.delete(
  '/:id',
  autorizarRoles(ROLES.ADMINISTRADOR),
  eliminarCita,
)

export default router
