// ============================================================
// CONSTANTES GLOBALES DEL BACKEND
// ============================================================
// Centralizar los valores evita errores de escritura (por ejemplo
// "administrador" vs "Administrador") y facilita cambiarlos en un
// solo lugar. Todos los controladores y middlewares importan de aquí.

// Roles que puede tener un usuario del sistema.
export const ROLES = Object.freeze({
  ADMINISTRADOR: 'administrador',
  RECEPCIONISTA: 'recepcionista',
  VETERINARIO: 'veterinario',
  PELUQUERO: 'peluquero',
  CLIENTE: 'cliente',
})

// Roles que pertenecen al personal de la clínica (todo excepto cliente).
export const ROLES_PERSONAL = Object.freeze([
  ROLES.ADMINISTRADOR,
  ROLES.RECEPCIONISTA,
  ROLES.VETERINARIO,
  ROLES.PELUQUERO,
])

// Estados posibles de una cuenta de usuario.
export const ESTADOS_USUARIO = Object.freeze({
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
})

export const ESTADOS_USUARIO_VALIDOS = Object.freeze(
  Object.values(ESTADOS_USUARIO),
)

// Estados posibles de una cita.
export const ESTADOS_CITA = Object.freeze({
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
})

export const ESTADOS_CITA_VALIDOS = Object.freeze(
  Object.values(ESTADOS_CITA),
)

// Una cita está "activa" mientras ocupa un espacio en la agenda.
// Las completadas y canceladas ya no bloquean horarios.
export const ESTADOS_CITA_ACTIVA = Object.freeze([
  ESTADOS_CITA.PENDIENTE,
  ESTADOS_CITA.CONFIRMADA,
])

// Configuración de seguridad de las contraseñas.
// 10 rondas es un equilibrio razonable entre seguridad y velocidad
// para un proyecto académico.
export const BCRYPT_RONDAS = 10

// Duración del token JWT. Al expirar, el frontend cierra la sesión.
export const JWT_EXPIRACION = '1h'

// Algoritmo explícito para firmar y verificar. Evita aceptar tokens
// firmados con algoritmos no permitidos (por ejemplo "none").
export const JWT_ALGORITMO = 'HS256'
