// ============================================================
// SERVIDOR PRINCIPAL DE SICVET
// ============================================================
// API REST simulada con datos en memoria. No usa base de datos:
// los datos viven en Backend/src/utils/almacen.js y se reinician
// al detener el servidor.

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Rutas de cada módulo.
import authRoutes from './routes/auth.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import mascotasRoutes from './routes/mascotas.routes.js'
import serviciosRoutes from './routes/servicios.routes.js'
import citasRoutes from './routes/citas.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

// Middlewares globales.
import { manejarErrores } from './middlewares/manejarErrores.js'
import { noEncontrado } from './middlewares/noEncontrado.js'

// ============================================================
// CONFIGURACIÓN INICIAL
// ============================================================

// Carga las variables de Backend/.env.
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// ============================================================
// MIDDLEWARES GENERALES
// ============================================================

// Orígenes permitidos para CORS. Se pueden separar por comas en
// FRONTEND_URL, por ejemplo:
// FRONTEND_URL=http://localhost:5173,http://localhost:4173
const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean)

app.use(
  cors({
    // cors acepta un arreglo de orígenes permitidos.
    origin: origenesPermitidos,
  }),
)

// Permite recibir cuerpos JSON. El límite evita peticiones enormes.
app.use(express.json({ limit: '100kb' }))

// ============================================================
// RUTAS GENERALES
// ============================================================

// Ruta informativa de la raíz.
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido al backend de SICVET',
    documentacion: 'Consulta Docs/PLAN-IMPLEMENTACION.md',
  })
})

// Comprobación rápida de que el servidor está vivo.
app.get('/api/health', (req, res) => {
  res.json({ mensaje: 'Servidor SICVET funcionando correctamente' })
})

// ============================================================
// RUTAS DE LA API
// ============================================================

app.use('/api/auth', authRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/clientes', clientesRoutes)
app.use('/api/mascotas', mascotasRoutes)
app.use('/api/servicios', serviciosRoutes)
app.use('/api/citas', citasRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ============================================================
// MANEJO DE RUTAS DESCONOCIDAS Y ERRORES
// ============================================================

// Debe ir después de todas las rutas.
app.use(noEncontrado)

// Debe ser el último middleware registrado.
app.use(manejarErrores)

// ============================================================
// VALIDACIÓN DE SEGURIDAD Y ARRANQUE
// ============================================================

// Sin un secreto suficientemente largo, los tokens serían fáciles
// de falsificar. Preferimos no arrancar antes que ser inseguros.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'Debes configurar un JWT_SECRET de al menos 32 caracteres en Backend/.env',
  )
}

app.listen(PORT, () => {
  console.log('=================================')
  console.log('      BACKEND SICVET')
  console.log('=================================')
  console.log(`Servidor: http://localhost:${PORT}`)
  console.log('Datos en memoria (sin base de datos)')
  console.log(`CORS permitido para: ${origenesPermitidos.join(', ')}`)
})
