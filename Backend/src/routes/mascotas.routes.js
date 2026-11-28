// ============================================================
// RUTAS DE MASCOTAS
// ============================================================
// Prefijo: /api/mascotas
// Todos los usuarios autenticados pueden acceder. El controlador
// limita a los clientes a sus propias mascotas.

import { Router } from 'express'
import {
  actualizarMascota,
  crearMascota,
  eliminarMascota,
  listarMascotas,
  obtenerMascota,
} from '../controllers/mascotas.controller.js'
import { verificarToken } from '../middlewares/verificarToken.js'

const router = Router()

router.use(verificarToken)

// GET /api/mascotas
router.get('/', listarMascotas)

// GET /api/mascotas/:id
router.get('/:id', obtenerMascota)

// POST /api/mascotas
router.post('/', crearMascota)

// PUT /api/mascotas/:id
router.put('/:id', actualizarMascota)

// DELETE /api/mascotas/:id
router.delete('/:id', eliminarMascota)

export default router
