// ============================================================
// PANTALLA PRINCIPAL (DASHBOARD)
// ============================================================
// Muestra los filtros de tiempo (Hoy, Semana, Mes...), las 6
// tarjetas con los números importantes y la lista de citas de hoy.
// Cambia un poco el estilo si entra el Administrador o la Recepcionista.

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/auth-context'
import { fechaHoy, iniciales, inicioMesActual } from '../../lib/formatters'
import { ROLES } from '../../lib/roles'
import { obtenerResumen } from './dashboard.api'

// Botones de tiempo que aparecen arriba.
const PERIODOS = ['Hoy', 'Semana', 'Mes', 'Año', 'Personalizado']

// Citas de ejemplo para mostrar cuando el servidor no está encendido.
const CITAS_HOY_PROTOTIPO = [
  {
    id: 1,
    hora: '09:00',
    iniciales: 'MG',
    avatarColor: 'bg-primary',
    mascota: 'Luna',
    cliente: 'María García',
    servicio: 'Consulta General',
    profesional: 'Dr. Alejandro Rivas',
    estado: 'Completada',
  },
  {
    id: 2,
    hora: '10:30',
    iniciales: 'MG',
    avatarColor: 'bg-primary',
    mascota: 'Mimi',
    cliente: 'María García',
    servicio: 'Vacunación',
    profesional: 'Dra. Valentina Suárez',
    estado: 'Pendiente',
  },
  {
    id: 3,
    hora: '11:00',
    iniciales: 'CR',
    avatarColor: 'bg-info',
    mascota: 'Rocky',
    cliente: 'Carlos Rodríguez',
    servicio: 'Peluquería',
    profesional: 'Marcos Delgado',
    estado: 'Pendiente',
  },
  {
    id: 4,
    hora: '14:00',
    iniciales: 'AM',
    avatarColor: 'bg-primary',
    mascota: 'Coco',
    cliente: 'Ana Martínez',
    servicio: 'Consulta General',
    profesional: 'Dr. Alejandro Rivas',
    estado: 'Cancelada',
  },
  {
    id: 5,
    hora: '15:30',
    iniciales: 'LH',
    avatarColor: 'bg-danger',
    mascota: 'Max',
    cliente: 'Luis Hernández',
    servicio: 'Baño y Grooming',
    profesional: 'Dra. Valentina Suárez',
    estado: 'Reprogramada',
  },
]

// Pone el color correcto a la etiqueta del estado de cada cita.
function badgeEstadoClase(estado) {
  switch (estado) {
    case 'Completada':
    case 'completada':
      return 'bg-success-subtle text-success'
    case 'Pendiente':
    case 'pendiente':
      return 'bg-primary-subtle text-primary'
    case 'Cancelada':
    case 'cancelada':
      return 'bg-danger-subtle text-danger'
    case 'Reprogramada':
    case 'reprogramada':
      return 'bg-warning-subtle text-warning-emphasis'
    default:
      return 'bg-secondary-subtle text-secondary'
  }
}

// Calcula la fecha de inicio y fin según el botón que tocó el usuario.
function rangoParaPeriodo(periodo) {
  const hoy = fechaHoy()
  if (periodo === 'Hoy') return { desde: hoy, hasta: hoy }
  if (periodo === 'Semana') {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - 7)
    return { desde: fecha.toISOString().slice(0, 10), hasta: hoy }
  }
  if (periodo === 'Año') {
    const anio = new Date().getFullYear()
    return { desde: `${anio}-01-01`, hasta: hoy }
  }
  return { desde: inicioMesActual(), hasta: hoy }
}

export default function DashboardPage() {
  const { usuario } = useAuth()
  const esRecepcionista = usuario?.rol === ROLES.RECEPCIONISTA
  const esCliente = usuario?.rol === ROLES.CLIENTE

  const [periodo, setPeriodo] = useState('Semana')
  const [filtros, setFiltros] = useState(() => rangoParaPeriodo('Semana'))
  const [resumen, setResumen] = useState(null)

  // Cada vez que cambia el rango de fechas, pedimos los números al servidor.
  useEffect(() => {
    let activo = true
    async function cargar() {
      try {
        const respuesta = await obtenerResumen(filtros)
        if (activo) setResumen(respuesta.datos.resumen)
      } catch {
        // Si el servidor está apagado, no pasa nada: se muestran los datos de ejemplo.
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [filtros])

  // Cambia el botón activo y actualiza las fechas (salvo en "Personalizado", donde el usuario las escribe).
  function seleccionarPeriodo(nuevoPeriodo) {
    setPeriodo(nuevoPeriodo)
    if (nuevoPeriodo !== 'Personalizado') {
      setFiltros(rangoParaPeriodo(nuevoPeriodo))
    }
  }

  const tarjetas = esCliente
    ? [
        {
          icono: 'bi-heart',
          bgIcono: 'bg-success-subtle text-success',
          borde: 'border-success',
          delta: '+8%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.totalMascotas ?? 2,
          etiqueta: 'Mis Mascotas',
        },
        {
          icono: 'bi-calendar-event',
          bgIcono: 'bg-primary-subtle text-primary',
          borde: 'border-primary',
          delta: '+5%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.pendientes ?? 2,
          etiqueta: 'Citas Programadas',
        },
        {
          icono: 'bi-check-circle',
          bgIcono: 'bg-success-subtle text-success',
          borde: 'border-success',
          delta: '+18%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.completadasPeriodo ?? 1,
          etiqueta: 'Citas Completadas',
        },
      ]
    : [
        {
          icono: 'bi-people',
          bgIcono: 'bg-primary-subtle text-primary',
          borde: 'border-primary',
          delta: '+12%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.totalClientes ?? 6,
          etiqueta: 'Clientes Registrados',
        },
        {
          icono: 'bi-heart-pulse',
          bgIcono: 'bg-success-subtle text-success',
          borde: 'border-success',
          delta: '+8%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.totalMascotas ?? 8,
          etiqueta: 'Mascotas Registradas',
        },
        {
          icono: 'bi-calendar-event',
          bgIcono: 'bg-primary-subtle text-primary',
          borde: 'border-primary',
          delta: '+5%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen ? resumen.pendientes + resumen.confirmadas : 10,
          etiqueta: 'Citas Programadas',
        },
        {
          icono: 'bi-check-circle',
          bgIcono: 'bg-success-subtle text-success',
          borde: 'border-success',
          delta: '+18%',
          deltaClase: 'bg-success-subtle text-success',
          valor: resumen?.completadasPeriodo ?? 3,
          etiqueta: 'Citas Completadas',
        },
        {
          icono: 'bi-x-circle',
          bgIcono: 'bg-danger-subtle text-danger',
          borde: 'border-danger',
          delta: '-3%',
          deltaClase: 'bg-danger-subtle text-danger',
          valor: 1,
          etiqueta: 'Citas Canceladas',
        },
        {
          icono: 'bi-arrow-repeat',
          bgIcono: 'bg-warning-subtle text-warning',
          borde: 'border-warning',
          delta: '+2%',
          deltaClase: 'bg-success-subtle text-success',
          valor: 1,
          etiqueta: 'Reprogramadas',
        },
      ]

  const citasHoy =
    resumen?.proximasCitas?.length > 0
      ? resumen.proximasCitas.map((c) => ({
          id: c.id,
          hora: c.hora?.slice(0, 5) || '09:00',
          iniciales: iniciales(c.cliente?.nombre || 'CL'),
          avatarColor: 'bg-primary',
          mascota: c.mascota?.nombre || 'Mascota',
          cliente: c.cliente?.nombre || 'Cliente',
          servicio: c.servicio?.nombre || 'Consulta',
          profesional: c.profesional?.nombre || 'Profesional',
          estado: c.estado || 'Pendiente',
        }))
      : CITAS_HOY_PROTOTIPO

  return (
    <div>
      {/* Filtros de Tiempo */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {PERIODOS.map((item) => {
          const activo = periodo === item
          if (esRecepcionista) {
            return (
              <button
                key={item}
                type="button"
                onClick={() => seleccionarPeriodo(item)}
                className={`btn rounded-pill px-3 py-1 border-0 small ${
                  activo
                    ? 'btn-primary shadow-sm fw-semibold'
                    : 'btn-white bg-white text-secondary fw-medium'
                }`}
              >
                {item}
              </button>
            )
          }
          return (
            <button
              key={item}
              type="button"
              onClick={() => seleccionarPeriodo(item)}
              className={`btn btn-sm rounded-pill px-3 ${
                activo ? 'btn-primary' : 'btn-light border'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>

      {/* Selector personalizado si el usuario elige "Personalizado" */}
      {periodo === 'Personalizado' && (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-sm-5">
              <label className="form-label text-muted fw-bold small text-uppercase sicvet-inline-style-008">
                Desde
              </label>
              <input
                type="date"
                className="form-control"
                value={filtros.desde}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, desde: e.target.value }))
                }
              />
            </div>
            <div className="col-12 col-sm-5">
              <label className="form-label text-muted fw-bold small text-uppercase sicvet-inline-style-008">
                Hasta
              </label>
              <input
                type="date"
                className="form-control"
                value={filtros.hasta}
                onChange={(e) =>
                  setFiltros((f) => ({ ...f, hasta: e.target.value }))
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* LAS 6 TARJETAS DE MÉTRICAS */}
      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div
            key={t.etiqueta}
            className={esRecepcionista ? 'col-12 col-md-6 col-xl-4' : 'col-md-4'}
          >
            <div
              className={`card border-0 shadow-sm p-3 rounded-4 ${
                esRecepcionista ? 'h-100' : ''
              }`}
            >
              <div
                className={`d-flex justify-content-between align-items-start ${
                  esRecepcionista ? 'mb-2' : ''
                }`}
              >
                <div
                  className={`${t.bgIcono} rounded-circle d-flex align-items-center justify-content-center sicvet-inline-style-007`}
                >
                  <i className={`bi ${t.icono} fs-5`} />
                </div>
                <span
                  className={`badge ${t.deltaClase} ${
                    esRecepcionista ? 'rounded-pill fw-semibold' : ''
                  }`}
                >
                  {t.delta}
                </span>
              </div>

              {esRecepcionista ? (
                <>
                  <h2 className="fw-bold mb-0">{t.valor}</h2>
                  <small className="text-muted fw-medium">{t.etiqueta}</small>
                  <div
                    className={`border-bottom ${t.borde} border-2 opacity-50 mt-3`}
                  />
                </>
              ) : (
                <>
                  <h3 className="fw-bold mt-2 mb-0">{t.valor}</h3>
                  <small className="text-muted">{t.etiqueta}</small>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CITAS DE HOY */}
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold mb-0">
            Citas de Hoy —{' '}
            <span className="text-muted fw-normal">1 Julio 2025</span>
          </h6>
          <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
            {citasHoy.length} citas
          </span>
        </div>

        {esRecepcionista ? (
          <div className="d-flex flex-column gap-3">
            {citasHoy.map((cita, idx) => (
              <div
                key={cita.id}
                className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 ${
                  idx < citasHoy.length - 1 ? 'pb-3 border-bottom' : ''
                }`}
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-primary sicvet-inline-style-033">
                    {cita.hora}
                  </span>
                  <div
                    className={`${cita.avatarColor} text-white rounded-circle fw-bold d-flex align-items-center justify-content-center flex-shrink-0 sicvet-inline-style-034`}
                  >
                    {cita.iniciales}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">
                      {cita.mascota} — {cita.cliente}
                    </h6>
                    <small className="text-muted">
                      {cita.servicio} · {cita.profesional}
                    </small>
                  </div>
                </div>
                <div>
                  <span
                    className={`badge ${badgeEstadoClase(
                      cita.estado,
                    )} fw-semibold px-3 py-2 rounded-pill`}
                  >
                    {cita.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
              <tbody>
                {citasHoy.map((cita) => (
                  <tr key={cita.id}>
                    <td className="fw-bold text-primary pe-4 sicvet-inline-style-015">
                      {cita.hora}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`${cita.avatarColor} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009`}
                        >
                          {cita.iniciales}
                        </div>
                        <div>
                          <strong>
                            {cita.mascota} — {cita.cliente}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {cita.servicio} · {cita.profesional}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="text-end">
                      <span
                        className={`badge ${badgeEstadoClase(
                          cita.estado,
                        )} rounded-pill px-3 py-2`}
                      >
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
