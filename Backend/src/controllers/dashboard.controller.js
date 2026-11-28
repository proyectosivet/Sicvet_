// ============================================================
// CONTROLADOR DEL DASHBOARD
// ============================================================
// Entrega las métricas que se muestran en el panel principal.
// Los números cambian según el rol:
//   - Cliente: solo sus mascotas y citas.
//   - Veterinario / peluquero: solo sus citas.
//   - Administrador / recepcionista: todo el sistema.

import { ESTADOS_CITA, ROLES } from '../config/constantes.js'
import { buscarClientePorUsuarioId, db } from '../utils/almacen.js'
import { citaConDetalles, ordenarCitas } from '../utils/citas.js'
import {
  esFechaValida,
  obtenerFechaHoy,
  obtenerInicioMes,
} from '../utils/validaciones.js'
import { responderError, responderExito } from '../utils/respuestas.js'

// ------------------------------------------------------------
// Utilidad interna: citas que puede ver el usuario según su rol.
// ------------------------------------------------------------
function citasVisibles(usuario) {
  if (usuario.rol === ROLES.CLIENTE) {
    const cliente = buscarClientePorUsuarioId(usuario.sub)
    return cliente
      ? db.citas.filter((cita) => cita.clienteId === cliente.id)
      : []
  }

  if ([ROLES.VETERINARIO, ROLES.PELUQUERO].includes(usuario.rol)) {
    return db.citas.filter(
      (cita) => cita.profesionalId === Number(usuario.sub),
    )
  }

  return [...db.citas]
}

// ------------------------------------------------------------
// GET /api/dashboard/resumen
// ------------------------------------------------------------
// Filtros opcionales: ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
// Por defecto el periodo es el mes actual hasta hoy.
export function obtenerResumen(req, res) {
  const desde = req.query.desde || obtenerInicioMes()
  const hasta = req.query.hasta || obtenerFechaHoy()

  if (!esFechaValida(desde) || !esFechaValida(hasta)) {
    return responderError(
      res,
      'Las fechas deben tener el formato YYYY-MM-DD',
      400,
    )
  }

  if (desde > hasta) {
    return responderError(
      res,
      'La fecha inicial no puede ser mayor que la final',
      400,
    )
  }

  const hoy = obtenerFechaHoy()
  const citas = citasVisibles(req.usuario)

  // Citas dentro del periodo consultado (para las tarjetas del
  // resumen y la distribución por estado).
  const citasPeriodo = citas.filter(
    (cita) => cita.fecha >= desde && cita.fecha <= hasta,
  )

  // Citas de hoy, sin importar el periodo elegido.
  const citasHoy = citas.filter((cita) => cita.fecha === hoy)

  // Citas activas próximas (pendientes o confirmadas).
  const citasActivasFuturas = citas.filter(
    (cita) =>
      [ESTADOS_CITA.PENDIENTE, ESTADOS_CITA.CONFIRMADA].includes(
        cita.estado,
      ) && cita.fecha >= hoy,
  )

  const pendientes = citasActivasFuturas.filter(
    (cita) => cita.estado === ESTADOS_CITA.PENDIENTE,
  )

  const confirmadas = citasActivasFuturas.filter(
    (cita) => cita.estado === ESTADOS_CITA.CONFIRMADA,
  )

  const completadasPeriodo = citasPeriodo.filter(
    (cita) => cita.estado === ESTADOS_CITA.COMPLETADA,
  )

  // Ingresos estimados: suma del precio del servicio de las citas
  // completadas dentro del periodo.
  const ingresosPeriodo = completadasPeriodo.reduce((total, cita) => {
    const servicio = db.servicios.find(
      (item) => item.id === cita.servicioId,
    )
    return total + (servicio ? servicio.precio : 0)
  }, 0)

  // Conteo por estado dentro del periodo.
  const porEstado = {
    [ESTADOS_CITA.PENDIENTE]: 0,
    [ESTADOS_CITA.CONFIRMADA]: 0,
    [ESTADOS_CITA.COMPLETADA]: 0,
    [ESTADOS_CITA.CANCELADA]: 0,
  }

  citasPeriodo.forEach((cita) => {
    if (porEstado[cita.estado] !== undefined) {
      porEstado[cita.estado] += 1
    }
  })

  // Totales globales. Para clientes y profesionales devolvemos null
  // en los datos que no les corresponden.
  const esCliente = req.usuario.rol === ROLES.CLIENTE
  const esPersonalClinica = [
    ROLES.ADMINISTRADOR,
    ROLES.RECEPCIONISTA,
  ].includes(req.usuario.rol)

  const clienteActual = esCliente
    ? buscarClientePorUsuarioId(req.usuario.sub)
    : null

  const totalMascotas = esCliente
    ? db.mascotas.filter(
        (mascota) => mascota.clienteId === clienteActual?.id,
      ).length
    : db.mascotas.length

  const totalClientes = esPersonalClinica ? db.clientes.length : null

  // Próximas 5 citas para la tabla del dashboard.
  const proximasCitas = ordenarCitas(citasActivasFuturas)
    .slice(0, 5)
    .map(citaConDetalles)

  return responderExito(res, 'Resumen obtenido correctamente', {
    resumen: {
      hoy,
      periodo: { desde, hasta },
      citasHoy: citasHoy.length,
      pendientes: pendientes.length,
      confirmadas: confirmadas.length,
      completadasPeriodo: completadasPeriodo.length,
      ingresosPeriodo,
      totalClientes,
      totalMascotas,
      porEstado,
      proximasCitas,
    },
  })
}
