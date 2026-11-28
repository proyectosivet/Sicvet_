// ============================================================
// SEED DE CLIENTES
// ============================================================
// Un cliente es el propietario de una o varias mascotas. Puede estar
// vinculado a una cuenta de usuario (usuarioId) o existir solo como
// registro administrativo creado por recepción.
//
// El cliente con id 1 está vinculado al usuario "cliente@sicvet.com"
// para que, al iniciar sesión, vea sus propias mascotas y citas.

const FECHA_SEED = '2026-01-20T09:00:00.000Z'

export const clientesSeed = [
  {
    id: 1,
    usuarioId: 5,
    nombre: 'Cliente SICVET',
    correo: 'cliente@sicvet.com',
    telefono: '3005556677',
    direccion: 'Calle 10 # 20-30, Bogotá',
    creadoEn: FECHA_SEED,
  },
  {
    id: 2,
    usuarioId: null,
    nombre: 'María García López',
    correo: 'maria.garcia@email.com',
    telefono: '3101234567',
    direccion: 'Carrera 15 # 45-67, Bogotá',
    creadoEn: FECHA_SEED,
  },
  {
    id: 3,
    usuarioId: null,
    nombre: 'Carlos Rodríguez Pérez',
    correo: 'carlos.rodriguez@email.com',
    telefono: '3207654321',
    direccion: 'Avenida 68 # 12-34, Bogotá',
    creadoEn: FECHA_SEED,
  },
  {
    id: 4,
    usuarioId: null,
    nombre: 'Ana Martínez Silva',
    correo: 'ana.martinez@email.com',
    telefono: '3159876543',
    direccion: 'Calle 80 # 55-10, Bogotá',
    creadoEn: FECHA_SEED,
  },
]
