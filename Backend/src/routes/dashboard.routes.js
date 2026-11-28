// ============================================================
// RUTAS DEL DASHBOARD
// ============================================================
// Prefijo: /api/dashboard
// Disponible para todos los usuarios autenticados. El controlador
// adapta las métricas al rol.

import { Router } from 'express'
import { obtenerResumen } from '../controllers/dashboard.controller.js'
import { verificarToken } from '../middlewares/verificarToken.js'

const router = Router()

router.use(verificarToken)

// GET /api/dashboard/resumen
router.get('/resumen', obtenerResumen)

export default router
