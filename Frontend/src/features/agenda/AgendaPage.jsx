// ============================================================
// PANTALLA DE AGENDA
// ============================================================
// Muestra una vista diferente según quién entre:
// - Veterinario: ve sus citas de hoy y su historial, sin botones de acción.
// - Peluquero: ve sus citas de hoy y su historial, con botones de "Atendido" y "No Asistió".
// - Administrador / Recepcionista: ve el horario semanal para bloquear horas
//   y la tabla para activar o desactivar los días de trabajo del personal.

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/auth-context'
import { ROLES } from '../../lib/roles'

// Días y horas que aparecen en el cuadro del horario semanal.
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DIAS_PERSONAL = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const HORAS_AGENDA = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

// Arma el horario inicial: casi todo disponible (true), salvo algunas horas de almuerzo bloqueadas (false).
function crearHorarioInicial() {
  const estado = {}
  for (const hora of HORAS_AGENDA) {
    estado[hora] = DIAS_SEMANA.map((_, idx) => {
      if (hora === '12:00' && (idx === 0 || idx === 2 || idx === 4)) return false
      if (hora === '13:00' && (idx === 1 || idx === 3)) return false
      return true
    })
  }
  return estado
}

const PERSONAL_INICIAL = [
  {
    id: 1,
    iniciales: 'DA',
    nombre: 'Dr. Alejandro Rivas',
    especialidad: 'Medicina General',
    dias: [true, true, true, true, true, true],
  },
  {
    id: 2,
    iniciales: 'DV',
    nombre: 'Dra. Valentina Suárez',
    especialidad: 'Cirugía',
    dias: [true, true, true, true, true, true],
  },
  {
    id: 3,
    iniciales: 'MD',
    nombre: 'Marcos Delgado',
    especialidad: 'Estética Canina',
    dias: [true, true, true, true, true, false],
  },
  {
    id: 4,
    iniciales: 'SC',
    nombre: 'Sofía Castillo',
    especialidad: 'Recepcionista',
    dias: [false, false, false, false, false, false],
  },
  {
    id: 5,
    iniciales: 'DM',
    nombre: 'Diego Méndez',
    especialidad: 'Recepcionista',
    dias: [false, false, false, false, false, false],
  },
]

const ESPECIALIDADES = [
  'Todos',
  'Medicina General',
  'Cirugía',
  'Estética Canina',
]

const CITAS_PELUQUERO_INICIAL = {
  hoy: [
    {
      id: 1,
      hora: '11:00',
      fecha: '2025-07-01',
      mascota: 'Rocky',
      cliente: 'Carlos Rodríguez',
      servicio: 'Peluquería',
      especie: 'Perro',
      estado: 'Pendiente',
    },
  ],
  historial: [
    {
      id: 2,
      hora: '15:30',
      fecha: '2025-06-30',
      mascota: 'Max',
      cliente: 'Luis Hernández',
      servicio: 'Baño y Grooming',
      especie: 'Perro',
      estado: 'Completada',
    },
  ],
}

const CITAS_VETERINARIO_INICIAL = {
  hoy: [
    {
      id: 1,
      hora: '09:00',
      fecha: '2025-07-01',
      mascota: 'Luna',
      cliente: 'María García',
      servicio: 'Consulta General',
      especie: 'Perro',
      estado: 'Completada',
    },
    {
      id: 2,
      hora: '14:00',
      fecha: '2025-07-01',
      mascota: 'Coco',
      cliente: 'Ana Martínez',
      servicio: 'Consulta General',
      especie: 'Perro',
      estado: 'Cancelada',
    },
  ],
  historial: [
    {
      id: 3,
      hora: '10:00',
      fecha: '2025-06-30',
      mascota: 'Simba',
      cliente: 'Roberto Morales',
      servicio: 'Vacunación',
      especie: 'Gato',
      estado: 'Completada',
    },
    {
      id: 4,
      hora: '11:00',
      fecha: '2025-07-02',
      mascota: 'Rocky',
      cliente: 'Carlos Rodríguez',
      servicio: 'Baño y Grooming',
      especie: 'Perro',
      estado: 'Pendiente',
    },
  ],
}

function badgeEstadoCita(estado) {
  if (estado === 'Completada') {
    return 'bg-success-subtle text-success'
  }
  if (estado === 'Cancelada' || estado === 'No Asistió') {
    return 'bg-danger-subtle text-danger'
  }
  return 'bg-primary-subtle text-primary'
}

function AgendaVeterinario() {
  const [tab, setTab] = useState('hoy')

  const listaVisible =
    tab === 'hoy'
      ? CITAS_VETERINARIO_INICIAL.hoy
      : CITAS_VETERINARIO_INICIAL.historial

  return (
    <div>
      {/* KPIs */}
      <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
        <div className="p-3 bg-primary-subtle rounded-3 text-center flex-fill">
          <div className="fs-2 fw-bold text-primary">2</div>
          <div className="fw-semibold text-primary sicvet-inline-style-032">
            Pendientes
          </div>
        </div>

        <div className="p-3 bg-success-subtle rounded-3 text-center flex-fill">
          <div className="fs-2 fw-bold text-success">0</div>
          <div className="fw-semibold text-success sicvet-inline-style-032">
            Completadas
          </div>
        </div>

        <div className="p-3 bg-danger-subtle rounded-3 text-center flex-fill">
          <div className="fs-2 fw-bold text-danger">0</div>
          <div className="fw-semibold text-danger sicvet-inline-style-032">
            No Asistió
          </div>
        </div>
      </div>

      {/* Tabs Hoy / Historial */}
      <ul className="nav nav-pills gap-2 mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link px-3 py-1 border-0 ${
              tab === 'hoy'
                ? 'active bg-white shadow-sm fw-semibold rounded-3 text-dark'
                : 'text-muted fw-medium'
            }`}
            onClick={() => setTab('hoy')}
          >
            Hoy
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link px-3 py-1 border-0 ${
              tab === 'historial'
                ? 'active bg-white shadow-sm fw-semibold rounded-3 text-dark'
                : 'text-muted fw-medium'
            }`}
            onClick={() => setTab('historial')}
          >
            Historial
          </button>
        </li>
      </ul>

      {/* Lista de citas */}
      <div className="d-flex flex-column gap-3">
        {listaVisible.map((cita) => (
          <div key={cita.id} className="card border-0 shadow-sm rounded-4 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3 gap-sm-4">
                <div className="text-center">
                  <h5 className="fw-bold text-primary mb-0 sicvet-inline-style-050">
                    {cita.hora}
                  </h5>
                  <small className="text-muted sicvet-inline-style-008">
                    {cita.fecha}
                  </small>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">{cita.mascota}</h6>
                  <p className="mb-0 text-muted small">
                    {cita.cliente} <span className="mx-1">•</span>{' '}
                    {cita.servicio}
                  </p>
                  <small className="text-muted sicvet-inline-style-008">
                    {cita.especie}
                  </small>
                </div>
              </div>
              <div>
                <span
                  className={`badge ${badgeEstadoCita(
                    cita.estado,
                  )} fw-semibold px-3 py-2 rounded-pill sicvet-inline-style-008`}
                >
                  {cita.estado}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaPeluquero() {
  const [tab, setTab] = useState('hoy')
  const [citas, setCitas] = useState(CITAS_PELUQUERO_INICIAL)

  const pendientes = citas.hoy.filter((c) => c.estado === 'Pendiente').length
  const completadas = citas.hoy.filter((c) => c.estado === 'Completada').length
  const noAsistio = citas.hoy.filter((c) => c.estado === 'No Asistió').length

  function actualizarEstado(id, nuevoEstado) {
    setCitas((prev) => ({
      hoy: prev.hoy.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)),
      historial: prev.historial.map((c) =>
        c.id === id ? { ...c, estado: nuevoEstado } : c,
      ),
    }))
    toast.success(`Cita marcada como ${nuevoEstado}`)
  }

  const listaVisible = tab === 'hoy' ? citas.hoy : citas.historial

  return (
    <div>
      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-primary-subtle text-primary rounded-4 p-3 text-center border-0">
            <span className="fs-2 fw-bold d-block">{pendientes}</span>
            <span className="small fw-semibold">Pendientes</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-success-subtle text-success rounded-4 p-3 text-center border-0">
            <span className="fs-2 fw-bold d-block">{completadas}</span>
            <span className="small fw-semibold">Completadas</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-danger-subtle text-danger rounded-4 p-3 text-center border-0">
            <span className="fs-2 fw-bold d-block">{noAsistio}</span>
            <span className="small fw-semibold">No Asistió</span>
          </div>
        </div>
      </div>

      {/* Filtros Hoy / Historial */}
      <div className="mb-4">
        <div
          className="btn-group bg-white p-1 rounded-3 shadow-sm border"
          role="group"
        >
          <button
            type="button"
            className={`btn px-4 rounded-2 py-1 border-0 ${
              tab === 'hoy'
                ? 'btn-light fw-bold shadow-sm'
                : 'btn-white text-secondary fw-semibold'
            }`}
            onClick={() => setTab('hoy')}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`btn px-4 rounded-2 py-1 border-0 ${
              tab === 'historial'
                ? 'btn-light fw-bold shadow-sm'
                : 'btn-white text-secondary fw-semibold'
            }`}
            onClick={() => setTab('historial')}
          >
            Historial
          </button>
        </div>
      </div>

      {/* Tarjeta de Cita Registrada */}
      <div className="d-flex flex-column gap-3">
        {listaVisible.map((cita) => (
          <div key={cita.id} className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex gap-4">
                <div className="text-center">
                  <span className="fw-bold text-primary fs-5 d-block">
                    {cita.hora}
                  </span>
                  <small className="text-secondary sicvet-inline-style-008">
                    {cita.fecha}
                  </small>
                </div>
                <div>
                  <h2 className="h5 fw-bold m-0">{cita.mascota}</h2>
                  <p className="text-secondary mb-1 small">
                    {cita.cliente} · {cita.servicio}
                  </p>
                  <span className="badge bg-light text-secondary border fw-normal">
                    {cita.especie}
                  </span>
                </div>
              </div>

              <span
                className={`badge ${badgeEstadoCita(cita.estado)} px-3 py-2 rounded-4 fw-semibold`}
              >
                {cita.estado}
              </span>
            </div>

            {cita.estado === 'Pendiente' && (
              <div className="row g-2 mt-2">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-success w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => actualizarEstado(cita.id, 'Completada')}
                  >
                    <i className="bi bi-check-circle" /> Atendido
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn bg-danger-subtle text-danger border-0 w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={() => actualizarEstado(cita.id, 'No Asistió')}
                  >
                    <i className="bi bi-x-circle" /> No Asistió
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaAdministrativa() {
  const [horario, setHorario] = useState(crearHorarioInicial)
  const [personal, setPersonal] = useState(PERSONAL_INICIAL)
  const [especialidad, setEspecialidad] = useState('Todos')

  function alternarCelda(hora, idxDia) {
    setHorario((prev) => ({
      ...prev,
      [hora]: prev[hora].map((disponible, i) =>
        i === idxDia ? !disponible : disponible,
      ),
    }))
  }

  function alternarDiaPersonal(idPersonal, idxDia) {
    setPersonal((prev) =>
      prev.map((p) =>
        p.id === idPersonal
          ? { ...p, dias: p.dias.map((v, i) => (i === idxDia ? !v : v)) }
          : p,
      ),
    )
  }

  const personalFiltrado =
    especialidad === 'Todos'
      ? personal
      : personal.filter((p) => p.especialidad === especialidad)

  return (
    <div>
      {/* BLOQUE SUPERIOR: HORARIO SEMANAL Y BLOQUEOS */}
      <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Horario Semanal</h6>
          <small className="text-muted">
            Toca una celda para bloquear / desbloquear
          </small>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless align-middle text-center mb-0">
            <thead>
              <tr className="text-muted small">
                <th className="sicvet-inline-style-010" />
                {DIAS_SEMANA.map((dia) => (
                  <th key={dia}>{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORAS_AGENDA.map((hora) => (
                <tr key={hora}>
                  <td className="text-muted small fw-medium">{hora}</td>
                  {horario[hora].map((disponible, idx) => (
                    <td key={`${hora}-${DIAS_SEMANA[idx]}`}>
                      <button
                        type="button"
                        onClick={() => alternarCelda(hora, idx)}
                        className={`btn btn-sm border-0 w-100 py-2 rounded-3 fw-medium ${
                          disponible
                            ? 'bg-primary-subtle text-primary'
                            : 'bg-danger-subtle text-danger'
                        }`}
                      >
                        {disponible ? 'Disp.' : 'Bloq.'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOQUE INFERIOR: DISPONIBILIDAD DEL PERSONAL POR DÍA */}
      <div className="card border-0 shadow-sm p-4 rounded-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h6 className="fw-bold mb-0">Disponibilidad del Personal</h6>
          <div className="d-flex gap-2 flex-wrap">
            {ESPECIALIDADES.map((esp) => (
              <button
                key={esp}
                type="button"
                onClick={() => setEspecialidad(esp)}
                className={`btn btn-sm rounded-pill px-3 ${
                  especialidad === esp
                    ? 'btn-primary'
                    : 'btn-light border text-secondary'
                }`}
              >
                {esp}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="text-muted small text-center">
                <th className="text-start">Personal</th>
                {DIAS_PERSONAL.map((dia) => (
                  <th key={dia} className="sicvet-inline-style-011">
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personalFiltrado.map((persona) => (
                <tr key={persona.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009">
                        {persona.iniciales}
                      </div>
                      <div>
                        <strong>{persona.nombre}</strong>
                        <br />
                        <small className="text-muted">
                          {persona.especialidad}
                        </small>
                      </div>
                    </div>
                  </td>
                  {persona.dias.map((activo, idx) => (
                    <td key={DIAS_PERSONAL[idx]} className="text-center">
                      <div className="form-check form-switch d-inline-block">
                        <input
                          className="form-check-input fs-5"
                          type="checkbox"
                          checked={activo}
                          onChange={() => alternarDiaPersonal(persona.id, idx)}
                          aria-label={`${persona.nombre} ${DIAS_PERSONAL[idx]}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function AgendaPage() {
  const { usuario } = useAuth()

  if (usuario?.rol === ROLES.VETERINARIO) {
    return <AgendaVeterinario />
  }

  if (usuario?.rol === ROLES.PELUQUERO) {
    return <AgendaPeluquero />
  }

  return <AgendaAdministrativa />
}
