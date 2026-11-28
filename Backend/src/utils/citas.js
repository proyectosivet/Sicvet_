// ============================================================
// UTILIDADES DE CITAS
// ============================================================
// Funciones compartidas entre el controlador de citas y el
// dashboard para no duplicar la lógica de "unir" una cita con los
// datos de cliente, mascota, servicio y profesional.

import { ESTADOS_CITA_ACTIVA } from '../config/constantes.js'
import { db } from './almacen.js'

// Convierte una cita "plana" (solo IDs) en un objeto con los datos
// que necesita el frontend para mostrarla en tablas y tarjetas.
export function citaConDetalles(cita) {
  const cliente = db.clientes.find((item) => item.id === cita.clienteId)
  const mascota = db.mascotas.find((item) => item.id === cita.mascotaId)
  const servicio = db.servicios.find((item) => item.id === cita.servicioId)
  const profesional = db.usuarios.find(
    (item) => item.id === cita.profesionalId,
  )

  return {
    ...cita,
    // Solo exponemos los campos necesarios de cada entidad.
    cliente: cliente
      ? {
          id: cliente.id,
          nombre: cliente.nombre,
          correo: cliente.correo,
          telefono: cliente.telefono,
        }
      : null,
    mascota: mascota
      ? {
          id: mascota.id,
          nombre: mascota.nombre,
          especie: mascota.especie,
          raza: mascota.raza,
        }
      : null,
    servicio: servicio
      ? {
          id: servicio.id,
          nombre: servicio.nombre,
          precio: servicio.precio,
          duracionMin: servicio.duracionMin,
        }
      : null,
    profesional: profesional
      ? {
          id: profesional.id,
          nombre: profesional.nombre,
          rol: profesional.rol,
        }
      : null,
  }
}

// Comprueba si un profesional ya tiene una cita activa en la misma
// fecha y hora. "excluirId" sirve al reprogramar: ignoramos la
// propia cita para no chocar consigo misma.
export function hayCruceHorario({
  profesionalId,
  fecha,
  hora,
  excluirId = null,
}) {
  return db.citas.some(
    (cita) =>
      cita.profesionalId === Number(profesionalId) &&
      cita.fecha === fecha &&
      cita.hora === hora &&
      ESTADOS_CITA_ACTIVA.includes(cita.estado) &&
      cita.id !== excluirId,
  )
}

// Ordena citas por fecha y hora de forma ascendente. Se usa en los
// listados y en las próximas citas del dashboard.
export function ordenarCitas(citas) {
  return [...citas].sort((a, b) => {
    const claveA = `${a.fecha} ${a.hora}`
    const claveB = `${b.fecha} ${b.hora}`
    return claveA.localeCompare(claveB)
  })
}
