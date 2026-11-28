// ============================================================
// CONTROLADOR DE CITAS
// ============================================================
// Es el núcleo del sistema. Incluye:
//   - Listados con filtros y control de acceso por rol.
//   - Creación y reprogramación.
//   - Validación de cruces de horario del profesional.
//   - Cambio de estado (confirmar, completar, cancelar).
//
// Reglas de acceso:
//   - Cliente: solo sus propias citas; puede crearlas y cancelarlas.
//   - Veterinario / peluquero: solo las citas asignadas a él.
//   - Administrador / recepcionista: todas.

import {
  ESTADOS_CITA,
  ESTADOS_CITA_ACTIVA,
  ESTADOS_CITA_VALIDOS,
  ROLES,
} from '../config/constantes.js'
import {
  buscarClientePorUsuarioId,
  db,
  siguienteId,
} from '../utils/almacen.js'
import {
  citaConDetalles,
  hayCruceHorario,
  ordenarCitas,
} from '../utils/citas.js'
import {
  esFechaValida,
  esHoraValida,
  formatearFechaLocal,
  limpiarTexto,
  obtenerFechaHoy,
  textoRequerido,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// Utilidades internas de permisos
// ------------------------------------------------------------

function esCliente(req) {
  return req.usuario.rol === ROLES.CLIENTE
}

function esProfesional(req) {
  return [ROLES.VETERINARIO, ROLES.PELUQUERO].includes(req.usuario.rol)
}

function clienteDelUsuario(req) {
  return buscarClientePorUsuarioId(req.usuario.sub)
}

// Comprueba si el usuario autenticado puede ver o modificar la cita.
function puedeAcceder(req, cita) {
  if (esCliente(req)) {
    const cliente = clienteDelUsuario(req)
    return Boolean(cliente) && cita.clienteId === cliente.id
  }

  if (esProfesional(req)) {
    return cita.profesionalId === Number(req.usuario.sub)
  }

  // Administrador y recepcionista tienen acceso total.
  return true
}

// Busca una cita por el parámetro :id de la URL.
function buscarCita(req) {
  return db.citas.find((cita) => cita.id === Number(req.params.id))
}

// ------------------------------------------------------------
// Validación de los datos de una cita
// ------------------------------------------------------------
// Recibe los IDs ya normalizados y devuelve { error } si algo está
// mal, o { cliente, mascota, servicio, profesional } si todo existe
// y las relaciones son coherentes.
function validarRelacionesCita({
  clienteId,
  mascotaId,
  servicioId,
  profesionalId,
  fecha,
  hora,
}) {
  const cliente = db.clientes.find((item) => item.id === clienteId)

  if (!cliente) {
    return { error: 'El cliente indicado no existe' }
  }

  const mascota = db.mascotas.find((item) => item.id === mascotaId)

  if (!mascota) {
    return { error: 'La mascota indicada no existe' }
  }

  // La mascota debe pertenecer al cliente de la cita.
  if (mascota.clienteId !== cliente.id) {
    return { error: 'La mascota no pertenece al cliente seleccionado' }
  }

  const servicio = db.servicios.find((item) => item.id === servicioId)

  if (!servicio) {
    return { error: 'El servicio indicado no existe' }
  }

  if (!servicio.activo) {
    return { error: 'El servicio seleccionado no está disponible' }
  }

  const profesional = db.usuarios.find(
    (item) => item.id === profesionalId,
  )

  if (!profesional) {
    return { error: 'El profesional indicado no existe' }
  }

  // Solo veterinarios y peluqueros atienden citas.
  if (![ROLES.VETERINARIO, ROLES.PELUQUERO].includes(profesional.rol)) {
    return {
      error: 'El profesional debe ser veterinario o peluquero',
    }
  }

  if (!esFechaValida(fecha)) {
    return { error: 'La fecha debe tener el formato YYYY-MM-DD' }
  }

  if (!esHoraValida(hora)) {
    return { error: 'La hora debe tener el formato HH:mm' }
  }

  // No permitimos agendar en fechas pasadas.
  if (fecha < obtenerFechaHoy()) {
    return { error: 'No se puede agendar una cita en una fecha pasada' }
  }

  return { cliente, mascota, servicio, profesional }
}

// ------------------------------------------------------------
// GET /api/citas
// ------------------------------------------------------------
// Filtros: ?fecha=&estado=&profesionalId=&clienteId=&mascotaId=
//          &desde=&hasta=
export function listarCitas(req, res) {
  const {
    fecha,
    estado,
    profesionalId,
    clienteId,
    mascotaId,
    desde,
    hasta,
  } = req.query

  let citas = [...db.citas]

  // 1. Aplicamos el alcance según el rol.
  if (esCliente(req)) {
    const cliente = clienteDelUsuario(req)

    if (!cliente) {
      return responderExito(res, 'Citas obtenidas correctamente', {
        total: 0,
        citas: [],
      })
    }

    citas = citas.filter((cita) => cita.clienteId === cliente.id)
  } else if (esProfesional(req)) {
    citas = citas.filter(
      (cita) => cita.profesionalId === Number(req.usuario.sub),
    )
  } else if (profesionalId) {
    citas = citas.filter(
      (cita) => cita.profesionalId === Number(profesionalId),
    )
  }

  // 2. Filtros opcionales de la URL.
  if (clienteId) {
    citas = citas.filter(
      (cita) => cita.clienteId === Number(clienteId),
    )
  }

  if (mascotaId) {
    citas = citas.filter(
      (cita) => cita.mascotaId === Number(mascotaId),
    )
  }

  if (fecha) {
    citas = citas.filter((cita) => cita.fecha === fecha)
  }

  if (desde) {
    citas = citas.filter((cita) => cita.fecha >= desde)
  }

  if (hasta) {
    citas = citas.filter((cita) => cita.fecha <= hasta)
  }

  if (estado) {
    citas = citas.filter((cita) => cita.estado === estado)
  }

  citas = ordenarCitas(citas)

  return responderExito(res, 'Citas obtenidas correctamente', {
    total: citas.length,
    citas: citas.map(citaConDetalles),
  })
}

// ------------------------------------------------------------
// GET /api/citas/mias
// ------------------------------------------------------------
// Atajo para que el cliente consulte únicamente sus citas.
export function listarMisCitas(req, res) {
  const cliente = clienteDelUsuario(req)

  if (!cliente) {
    return responderExito(res, 'Citas obtenidas correctamente', {
      total: 0,
      citas: [],
    })
  }

  const citas = ordenarCitas(
    db.citas.filter((cita) => cita.clienteId === cliente.id),
  )

  return responderExito(res, 'Citas obtenidas correctamente', {
    total: citas.length,
    citas: citas.map(citaConDetalles),
  })
}

// ------------------------------------------------------------
// GET /api/citas/agenda
// ------------------------------------------------------------
// Agenda del personal para un rango de fechas. Por defecto muestra
// desde hoy hasta dentro de 7 días.
export function obtenerAgenda(req, res) {
  const hoy = new Date()
  const finSemana = new Date()
  finSemana.setDate(finSemana.getDate() + 7)

  const desde = req.query.desde || formatearFechaLocal(hoy)
  const hasta = req.query.hasta || formatearFechaLocal(finSemana)

  if (!esFechaValida(desde) || !esFechaValida(hasta)) {
    return responderError(
      res,
      'Las fechas de la agenda deben tener el formato YYYY-MM-DD',
      400,
    )
  }

  let citas = db.citas.filter(
    (cita) => cita.fecha >= desde && cita.fecha <= hasta,
  )

  // El veterinario y el peluquero solo ven su propia agenda.
  if (esProfesional(req)) {
    citas = citas.filter(
      (cita) => cita.profesionalId === Number(req.usuario.sub),
    )
  } else if (req.query.profesionalId) {
    citas = citas.filter(
      (cita) =>
        cita.profesionalId === Number(req.query.profesionalId),
    )
  }

  citas = ordenarCitas(citas)

  return responderExito(res, 'Agenda obtenida correctamente', {
    desde,
    hasta,
    total: citas.length,
    citas: citas.map(citaConDetalles),
  })
}

// ------------------------------------------------------------
// GET /api/citas/:id
// ------------------------------------------------------------
export function obtenerCita(req, res) {
  const cita = buscarCita(req)

  if (!cita) {
    return responderError(res, 'Cita no encontrada', 404)
  }

  if (!puedeAcceder(req, cita)) {
    return responderError(res, 'No tienes permisos sobre esta cita', 403)
  }

  return responderExito(res, 'Cita obtenida correctamente', {
    cita: citaConDetalles(cita),
  })
}

// ------------------------------------------------------------
// POST /api/citas
// ------------------------------------------------------------
export function crearCita(req, res) {
  const {
    clienteId,
    mascotaId,
    servicioId,
    profesionalId,
    fecha,
    hora,
    notas,
  } = req.body || {}

  // 1. Si quien crea la cita es un cliente, se fuerza su propio ID
  //    de cliente. No puede agendar para otra persona.
  let clienteFinalId

  if (esCliente(req)) {
    const cliente = clienteDelUsuario(req)

    if (!cliente) {
      return responderError(
        res,
        'No tienes un registro de cliente asociado',
        403,
      )
    }

    clienteFinalId = cliente.id
  } else {
    if (!textoRequerido(String(clienteId ?? ''))) {
      return responderError(res, 'Debes seleccionar un cliente', 400)
    }

    clienteFinalId = Number(clienteId)
  }

  // 2. Campos obligatorios.
  if (
    !mascotaId ||
    !servicioId ||
    !profesionalId ||
    !textoRequerido(fecha) ||
    !textoRequerido(hora)
  ) {
    return responderError(
      res,
      'Mascota, servicio, profesional, fecha y hora son obligatorios',
      400,
    )
  }

  // 3. Validamos relaciones y formatos.
  const validacion = validarRelacionesCita({
    clienteId: clienteFinalId,
    mascotaId: Number(mascotaId),
    servicioId: Number(servicioId),
    profesionalId: Number(profesionalId),
    fecha,
    hora,
  })

  if (validacion.error) {
    return responderError(res, validacion.error, 400)
  }

  // 4. Evitamos doble reserva del mismo profesional.
  if (
    hayCruceHorario({
      profesionalId: Number(profesionalId),
      fecha,
      hora,
    })
  ) {
    return responderError(
      res,
      'El profesional ya tiene una cita en esa fecha y hora',
      409,
    )
  }

  // 5. Creamos la cita en estado pendiente.
  const nuevaCita = {
    id: siguienteId('citas'),
    clienteId: clienteFinalId,
    mascotaId: Number(mascotaId),
    servicioId: Number(servicioId),
    profesionalId: Number(profesionalId),
    fecha,
    hora,
    estado: ESTADOS_CITA.PENDIENTE,
    notas: limpiarTexto(notas),
    creadoEn: new Date().toISOString(),
  }

  db.citas.push(nuevaCita)

  return responderExito(
    res,
    'Cita agendada correctamente',
    { cita: citaConDetalles(nuevaCita) },
    201,
  )
}

// ------------------------------------------------------------
// PUT /api/citas/:id
// ------------------------------------------------------------
// Reprograma o actualiza una cita que siga activa.
export function actualizarCita(req, res) {
  const cita = buscarCita(req)

  if (!cita) {
    return responderError(res, 'Cita no encontrada', 404)
  }

  if (!puedeAcceder(req, cita)) {
    return responderError(res, 'No tienes permisos sobre esta cita', 403)
  }

  if (!ESTADOS_CITA_ACTIVA.includes(cita.estado)) {
    return responderError(
      res,
      'No se puede modificar una cita completada o cancelada',
      409,
    )
  }

  const {
    clienteId,
    mascotaId,
    servicioId,
    profesionalId,
    fecha,
    hora,
    notas,
  } = req.body || {}

  // 1. Mezclamos los datos actuales con los enviados.
  const datosActualizados = {
    clienteId: esCliente(req)
      ? cita.clienteId
      : clienteId !== undefined
        ? Number(clienteId)
        : cita.clienteId,
    mascotaId:
      mascotaId !== undefined ? Number(mascotaId) : cita.mascotaId,
    servicioId:
      servicioId !== undefined ? Number(servicioId) : cita.servicioId,
    profesionalId:
      profesionalId !== undefined
        ? Number(profesionalId)
        : cita.profesionalId,
    fecha: fecha !== undefined ? fecha : cita.fecha,
    hora: hora !== undefined ? hora : cita.hora,
  }

  // 2. Validamos el resultado completo.
  const validacion = validarRelacionesCita(datosActualizados)

  if (validacion.error) {
    return responderError(res, validacion.error, 400)
  }

  // 3. Comprobamos cruces ignorando esta misma cita.
  if (
    hayCruceHorario({
      profesionalId: datosActualizados.profesionalId,
      fecha: datosActualizados.fecha,
      hora: datosActualizados.hora,
      excluirId: cita.id,
    })
  ) {
    return responderError(
      res,
      'El profesional ya tiene una cita en esa fecha y hora',
      409,
    )
  }

  // 4. Aplicamos los cambios.
  Object.assign(cita, datosActualizados)

  if (notas !== undefined) {
    cita.notas = limpiarTexto(notas)
  }

  return responderExito(res, 'Cita actualizada correctamente', {
    cita: citaConDetalles(cita),
  })
}

// ------------------------------------------------------------
// PATCH /api/citas/:id/estado
// ------------------------------------------------------------
// Cambia el estado de la cita. Un cliente solo puede cancelar.
export function cambiarEstadoCita(req, res) {
  const cita = buscarCita(req)

  if (!cita) {
    return responderError(res, 'Cita no encontrada', 404)
  }

  if (!puedeAcceder(req, cita)) {
    return responderError(res, 'No tienes permisos sobre esta cita', 403)
  }

  const { estado } = req.body || {}

  if (!ESTADOS_CITA_VALIDOS.includes(estado)) {
    return responderError(
      res,
      `Estado inválido. Usa: ${ESTADOS_CITA_VALIDOS.join(', ')}`,
      400,
    )
  }

  // El cliente únicamente puede cancelar sus citas activas.
  if (esCliente(req)) {
    if (estado !== ESTADOS_CITA.CANCELADA) {
      return responderError(
        res,
        'Como cliente solo puedes cancelar la cita',
        403,
      )
    }

    if (!ESTADOS_CITA_ACTIVA.includes(cita.estado)) {
      return responderError(
        res,
        'La cita ya está completada o cancelada',
        409,
      )
    }
  }

  cita.estado = estado

  return responderExito(res, 'Estado de la cita actualizado', {
    cita: citaConDetalles(cita),
  })
}

// ------------------------------------------------------------
// DELETE /api/citas/:id
// ------------------------------------------------------------
// Solo el administrador puede eliminar definitivamente una cita.
export function eliminarCita(req, res) {
  const indice = db.citas.findIndex(
    (cita) => cita.id === Number(req.params.id),
  )

  if (indice === -1) {
    return responderError(res, 'Cita no encontrada', 404)
  }

  db.citas.splice(indice, 1)

  return responderExito(res, 'Cita eliminada correctamente')
}
