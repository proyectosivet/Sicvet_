// ============================================================
// SEED DE USUARIOS
// ============================================================
// Datos iniciales que viven en memoria. Al reiniciar el servidor se
// vuelven a crear desde este archivo.
//
// Las contraseñas se guardan HASHEADAS con bcrypt, nunca en texto
// plano. Las credenciales de demostración son:
//   admin@sicvet.com       / admin123
//   recepcion@sicvet.com   / recepcion123
//   veterinario@sicvet.com / veterinario123
//   peluquero@sicvet.com   / peluquero123
//   cliente@sicvet.com     / cliente123
//
// IMPORTANTE: estas cuentas son solo para la demostración académica.

import bcrypt from 'bcryptjs'
import { BCRYPT_RONDAS, ESTADOS_USUARIO, ROLES } from '../config/constantes.js'

// Función auxiliar para no repetir el hash en cada usuario.
// hashSync se ejecuta una sola vez al cargar el módulo.
function hashear(contrasena) {
  return bcrypt.hashSync(contrasena, BCRYPT_RONDAS)
}

// Fecha de creación común para los datos semilla.
const FECHA_SEED = '2026-01-15T08:00:00.000Z'

export const usuariosSeed = [
  {
    id: 1,
    nombre: 'Administrador SICVET',
    correo: 'admin@sicvet.com',
    passwordHash: hashear('admin123'),
    rol: ROLES.ADMINISTRADOR,
    telefono: '3001112233',
    direccion: 'Sede principal Máscol-Colombia',
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: FECHA_SEED,
  },
  {
    id: 2,
    nombre: 'Recepcionista SICVET',
    correo: 'recepcion@sicvet.com',
    passwordHash: hashear('recepcion123'),
    rol: ROLES.RECEPCIONISTA,
    telefono: '3002223344',
    direccion: 'Sede principal Máscol-Colombia',
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: FECHA_SEED,
  },
  {
    id: 3,
    nombre: 'Veterinario SICVET',
    correo: 'veterinario@sicvet.com',
    passwordHash: hashear('veterinario123'),
    rol: ROLES.VETERINARIO,
    telefono: '3003334455',
    direccion: 'Sede principal Máscol-Colombia',
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: FECHA_SEED,
  },
  {
    id: 4,
    nombre: 'Peluquero SICVET',
    correo: 'peluquero@sicvet.com',
    passwordHash: hashear('peluquero123'),
    rol: ROLES.PELUQUERO,
    telefono: '3004445566',
    direccion: 'Sede principal Máscol-Colombia',
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: FECHA_SEED,
  },
  {
    id: 5,
    nombre: 'Cliente SICVET',
    correo: 'cliente@sicvet.com',
    passwordHash: hashear('cliente123'),
    rol: ROLES.CLIENTE,
    telefono: '3005556677',
    direccion: 'Calle 10 # 20-30, Bogotá',
    estado: ESTADOS_USUARIO.ACTIVO,
    creadoEn: FECHA_SEED,
  },
]
