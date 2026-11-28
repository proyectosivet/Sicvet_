// ============================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================
// Prefijo: /api/auth
// Las rutas públicas no requieren token. Las privadas usan el
// middleware verificarToken.

import { Router } from 'express'
import {
  actualizarPerfil,
  cambiarPassword,
  login,
  obtenerPerfil,
  recuperarPassword,
  registro,
} from '../controllers/auth.controller.js'
import { verificarToken } from '../middlewares/verificarToken.js'

const router = Router()

// ------------------- Rutas públicas -------------------

// POST /api/auth/login
router.post('/login', login)

// POST /api/auth/registro
router.post('/registro', registro)

// POST /api/auth/recuperar (envío de correo simulado)
router.post('/recuperar', recuperarPassword)

// ------------------- Rutas privadas -------------------

// GET /api/auth/perfil
router.get('/perfil', verificarToken, obtenerPerfil)

// PUT /api/auth/perfil
router.put('/perfil', verificarToken, actualizarPerfil)

// PUT /api/auth/password
router.put('/password', verificarToken, cambiarPassword)

export default router
