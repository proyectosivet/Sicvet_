// ============================================================
// PANTALLA DE HISTORIAL DE CITAS / MIS CITAS
// ============================================================
// - Si entra un Cliente: ve sus próximas citas (para reprogramar o cancelar)
//   y abajo su historial de citas pasadas.
// - Si entra el personal: ve una tabla con buscador, filtro por fecha
//   y botones para filtrar por estado.

import { useState } from 'react'
import { toast } from 'sonner'
import BootstrapModal from '../../components/ui/BootstrapModal'
import { useAuth } from '../../context/auth-context'
import { ROLES } from '../../lib/roles'

// Citas de ejemplo para la vista del cliente.
const CITAS_CLIENTE_INICIALES = [
  {
    id: 1,
    mascota: 'Mimi',
    servicio: 'Vacunación',
    fecha: '2025-07-01',
    hora: '10:30',
    profesional: 'Dra. Valentina Suárez',
    estado: 'Pendiente',
  },
  {
    id: 2,
    mascota: 'Luna',
    servicio: 'Peluquería',
    fecha: '2025-07-03',
    hora: '10:00',
    profesional: 'Marcos Delgado',
    estado: 'Pendiente',
  },
  {
    id: 3,
    mascota: 'Luna',
    servicio: 'Consulta General',
    fecha: '2025-07-01',
    hora: '09:00',
    profesional: 'Dr. Alejandro Rivas',
    estado: 'Completada',
  },
]

const CITAS_ADMIN_INICIALES = [
  {
    id: 1,
    cliente: 'María García',
    mascota: 'Luna · Perro',
    personal: 'Dr. Alejandro Rivas',
    iniciales: 'DA',
    servicio: 'Consulta General',
    fecha: '2025-07-01',
    hora: '09:00',
    estado: 'Completada',
  },
  {
    id: 2,
    cliente: 'María García',
    mascota: 'Mimi · Gato',
    personal: 'Dra. Valentina Suárez',
    iniciales: 'DV',
    servicio: 'Vacunación',
    fecha: '2025-07-01',
    hora: '10:30',
    estado: 'Pendiente',
  },
  {
    id: 3,
    cliente: 'Carlos Rodríguez',
    mascota: 'Rocky · Perro',
    personal: 'Marcos Delgado',
    iniciales: 'MD',
    servicio: 'Peluquería',
    fecha: '2025-07-01',
    hora: '11:00',
    estado: 'Pendiente',
  },
  {
    id: 4,
    cliente: 'Ana Martínez',
    mascota: 'Coco · Perro',
    personal: 'Dr. Alejandro Rivas',
    iniciales: 'DA',
    servicio: 'Consulta General',
    fecha: '2025-07-01',
    hora: '14:00',
    estado: 'Cancelada',
  },
  {
    id: 5,
    cliente: 'Luis Hernández',
    mascota: 'Max · Perro',
    personal: 'Dra. Valentina Suárez',
    iniciales: 'DV',
    servicio: 'Baño y Grooming',
    fecha: '2025-07-01',
    hora: '15:30',
    estado: 'Reprogramada',
  },
]

const FILTROS_ESTADO = [
  { etiqueta: 'Todas', valor: 'Todas' },
  { etiqueta: 'Pendientes', valor: 'Pendiente' },
  { etiqueta: 'Completadas', valor: 'Completada' },
  { etiqueta: 'Canceladas', valor: 'Cancelada' },
  { etiqueta: 'Reprogramadas', valor: 'Reprogramada' },
]

function claseBadgeEstado(estado) {
  switch (estado) {
    case 'Completada':
      return 'bg-success-subtle text-success'
    case 'Pendiente':
      return 'bg-primary-subtle text-primary'
    case 'Cancelada':
      return 'bg-danger-subtle text-danger'
    case 'Reprogramada':
      return 'bg-warning-subtle text-warning-emphasis'
    default:
      return 'bg-secondary-subtle text-secondary'
  }
}

function MisCitasCliente() {
  const [citas, setCitas] = useState(CITAS_CLIENTE_INICIALES)
  const [citaReprogramar, setCitaReprogramar] = useState(null)
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [nuevaHora, setNuevaHora] = useState('09:00')

  const proximas = citas.filter(
    (c) => c.estado === 'Pendiente' || c.estado === 'Reprogramada',
  )
  const historial = citas.filter(
    (c) => c.estado === 'Completada' || c.estado === 'Cancelada',
  )

  function abrirReprogramar(cita) {
    setCitaReprogramar(cita)
    setNuevaFecha(cita.fecha)
    setNuevaHora(cita.hora)
  }

  function confirmarReprogramacion() {
    if (!citaReprogramar) return
    setCitas((prev) =>
      prev.map((c) =>
        c.id === citaReprogramar.id
          ? { ...c, fecha: nuevaFecha, hora: nuevaHora, estado: 'Reprogramada' }
          : c,
      ),
    )
    setCitaReprogramar(null)
    toast.success('Cita reprogramada')
  }

  function cancelarCita(id) {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: 'Cancelada' } : c)),
    )
    toast.success('Cita cancelada')
  }

  return (
    <div>
      {/* PRÓXIMAS CITAS */}
      <h6 className="text-muted text-uppercase fw-bold mb-3 sicvet-inline-style-008">
        PRÓXIMAS CITAS
      </h6>

      {proximas.length === 0 ? (
        <div className="card border-0 shadow-sm p-4 rounded-4 mb-4 text-muted small">
          No tienes citas próximas programadas.
        </div>
      ) : (
        proximas.map((cita, idx) => (
          <div
            key={cita.id}
            className={`card border-0 shadow-sm p-4 rounded-4 ${
              idx === proximas.length - 1 ? 'mb-4' : 'mb-3'
            }`}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-0">{cita.mascota}</h6>
                <p className="text-muted small mb-3">{cita.servicio}</p>
                <div className="d-flex gap-4 text-muted small mb-2">
                  <span>
                    <i className="bi bi-calendar me-1" /> {cita.fecha}
                  </span>
                  <span>
                    <i className="bi bi-clock me-1" /> {cita.hora}
                  </span>
                </div>
                <p className="text-muted small mb-0">
                  <i className="bi bi-person me-1" /> {cita.profesional}
                </p>
              </div>
              <span
                className={`badge ${claseBadgeEstado(cita.estado)} rounded-pill px-3 py-2`}
              >
                {cita.estado}
              </span>
            </div>
            <div className="d-flex align-items-center gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill px-4 py-2 fw-medium"
                onClick={() => abrirReprogramar(cita)}
              >
                Reprogramar
              </button>
              <button
                type="button"
                className="btn btn-link text-danger text-decoration-none btn-sm fw-medium"
                onClick={() => cancelarCita(cita.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ))
      )}

      {/* HISTORIAL */}
      <h6 className="text-muted text-uppercase fw-bold mb-3 sicvet-inline-style-008">
        HISTORIAL
      </h6>

      <div className="d-flex flex-column gap-3">
        {historial.map((cita) => (
          <div key={cita.id} className="card border-0 shadow-sm p-4 rounded-4">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold mb-0">{cita.mascota}</h6>
                <p className="text-muted small mb-3">{cita.servicio}</p>
                <div className="d-flex gap-4 text-muted small mb-2">
                  <span>
                    <i className="bi bi-calendar me-1" /> {cita.fecha}
                  </span>
                  <span>
                    <i className="bi bi-clock me-1" /> {cita.hora}
                  </span>
                </div>
                <p className="text-muted small mb-0">
                  <i className="bi bi-person me-1" /> {cita.profesional}
                </p>
              </div>
              <span
                className={`badge ${claseBadgeEstado(cita.estado)} rounded-pill px-3 py-2`}
              >
                {cita.estado}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL REPROGRAMAR */}
      <BootstrapModal
        abierto={Boolean(citaReprogramar)}
        onCerrar={() => setCitaReprogramar(null)}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Reprogramar Cita</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setCitaReprogramar(null)}
            aria-label="Cerrar"
          />
        </div>
        <div className="modal-body py-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                NUEVA FECHA
              </label>
              <input
                type="date"
                className="form-control border rounded-3 shadow-none"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                NUEVA HORA
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={nuevaHora}
                onChange={(e) => setNuevaHora(e.target.value)}
              >
                <option value="09:00">09:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:30">03:30 PM</option>
              </select>
            </div>
          </div>
        </div>
        <div className="modal-footer border-0 pt-0 d-flex gap-2">
          <button
            type="button"
            className="btn btn-light rounded-pill px-4 border flex-grow-1 text-secondary"
            onClick={() => setCitaReprogramar(null)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 flex-grow-1 fw-medium"
            onClick={confirmarReprogramacion}
          >
            Confirmar
          </button>
        </div>
      </BootstrapModal>
    </div>
  )
}

function HistorialPersonal() {
  const [busqueda, setBusqueda] = useState('')
  const [fecha, setFecha] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('Todas')

  const filtradas = CITAS_ADMIN_INICIALES.filter((c) => {
    if (estadoFiltro !== 'Todas' && c.estado !== estadoFiltro) return false
    if (fecha && c.fecha !== fecha) return false
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      c.cliente.toLowerCase().includes(q) ||
      c.mascota.toLowerCase().includes(q) ||
      c.personal.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Buscador, Fecha y Filtros de Estado */}
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="input-group bg-white rounded-3 shadow-sm border-0 px-2 py-1 flex-grow-1 w-100">
            <span className="input-group-text bg-transparent border-0 text-muted">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none bg-transparent"
              placeholder="Buscar por cliente, mascota o personal..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-3 shadow-sm px-3 py-2 border-0 w-100 w-md-auto text-center">
            <input
              type="date"
              className="border-0 bg-transparent text-muted small fw-medium shadow-none"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {FILTROS_ESTADO.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => setEstadoFiltro(f.valor)}
              className={`btn rounded-pill px-3 py-1 border-0 small ${
                estadoFiltro === f.valor
                  ? 'btn-primary shadow-sm fw-semibold'
                  : 'btn-white bg-white text-secondary fw-medium'
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* Contenedor Tabla */}
      <div className="card border-0 shadow-sm rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="text-muted text-uppercase sicvet-inline-style-008">
                <th>CLIENTE / MASCOTA</th>
                <th>PERSONAL</th>
                <th>SERVICIO</th>
                <th>FECHA / HORA</th>
                <th className="text-end pe-3">ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((cita) => (
                <tr key={cita.id}>
                  <td>
                    <strong>{cita.cliente}</strong>
                    <br />
                    <small className="text-muted">{cita.mascota}</small>
                  </td>
                  <td>{cita.personal}</td>
                  <td>{cita.servicio}</td>
                  <td>
                    {cita.fecha}{' '}
                    <small className="text-muted">{cita.hora}</small>
                  </td>
                  <td className="text-end pe-3">
                    <span
                      className={`badge ${claseBadgeEstado(cita.estado)} rounded-pill px-3 py-2`}
                    >
                      {cita.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function HistorialCitasPage() {
  const { usuario } = useAuth()

  if (usuario?.rol === ROLES.CLIENTE) {
    return <MisCitasCliente />
  }

  return <HistorialPersonal />
}
