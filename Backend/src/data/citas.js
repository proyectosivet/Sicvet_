// ============================================================
// SEED DE CITAS
// ============================================================
// Las fechas se calculan de forma relativa al día en que arranca el
// servidor. Así el dashboard siempre tiene citas "de hoy" y el
// historial tiene datos de días anteriores.
//
// profesionalId debe ser un usuario con rol veterinario o peluquero:
//   id 3 = Veterinario SICVET
//   id 4 = Peluquero SICVET

import { ESTADOS_CITA } from '../config/constantes.js'
import { formatearFechaLocal } from '../utils/validaciones.js'

// Devuelve la fecha de hoy desplazada N días en formato YYYY-MM-DD.
function fechaRelativa(dias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  return formatearFechaLocal(fecha)
}

// Fecha fija de creación para que los datos semilla sean estables.
const FECHA_SEED = '2026-01-25T10:00:00.000Z'

export const citasSeed = [
  {
    id: 1,
    clienteId: 1,
    mascotaId: 1,
    servicioId: 1,
    profesionalId: 3,
    fecha: fechaRelativa(0),
    hora: '09:00',
    estado: ESTADOS_CITA.PENDIENTE,
    notas: 'Control general de Rocky.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 2,
    clienteId: 2,
    mascotaId: 3,
    servicioId: 2,
    profesionalId: 3,
    fecha: fechaRelativa(0),
    hora: '10:30',
    estado: ESTADOS_CITA.CONFIRMADA,
    notas: 'Refuerzo de vacuna anual.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 3,
    clienteId: 2,
    mascotaId: 4,
    servicioId: 3,
    profesionalId: 4,
    fecha: fechaRelativa(0),
    hora: '11:00',
    estado: ESTADOS_CITA.CONFIRMADA,
    notas: 'Baño y corte.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 4,
    clienteId: 1,
    mascotaId: 2,
    servicioId: 1,
    profesionalId: 3,
    fecha: fechaRelativa(1),
    hora: '09:30',
    estado: ESTADOS_CITA.PENDIENTE,
    notas: 'Revisión por pérdida de apetito.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 5,
    clienteId: 3,
    mascotaId: 5,
    servicioId: 4,
    profesionalId: 4,
    fecha: fechaRelativa(2),
    hora: '14:00',
    estado: ESTADOS_CITA.CONFIRMADA,
    notas: 'Corte de uñas.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 6,
    clienteId: 4,
    mascotaId: 6,
    servicioId: 5,
    profesionalId: 3,
    fecha: fechaRelativa(-1),
    hora: '10:00',
    estado: ESTADOS_CITA.COMPLETADA,
    notas: 'Desparasitación aplicada sin novedad.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 7,
    clienteId: 1,
    mascotaId: 1,
    servicioId: 2,
    profesionalId: 3,
    fecha: fechaRelativa(-2),
    hora: '11:30',
    estado: ESTADOS_CITA.COMPLETADA,
    notas: 'Vacuna aplicada.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 8,
    clienteId: 2,
    mascotaId: 3,
    servicioId: 5,
    profesionalId: 3,
    fecha: fechaRelativa(-3),
    hora: '09:00',
    estado: ESTADOS_CITA.CANCELADA,
    notas: 'El cliente no pudo asistir.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 9,
    clienteId: 3,
    mascotaId: 5,
    servicioId: 6,
    profesionalId: 3,
    fecha: fechaRelativa(-5),
    hora: '15:00',
    estado: ESTADOS_CITA.COMPLETADA,
    notas: 'Control postoperatorio satisfactorio.',
    creadoEn: FECHA_SEED,
  },
]
