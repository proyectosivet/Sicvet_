// ============================================================
// PANTALLA DE SERVICIOS (ROL CLIENTE)
// ============================================================
// Muestra los 4 servicios de la veterinaria. Al tocar "Reservar Cita"
// en cualquiera de ellos, se abre la ventanita ya con ese servicio elegido.

import { useState } from 'react'
import { toast } from 'sonner'
import BootstrapModal from '../../components/ui/BootstrapModal'

// Los 4 servicios disponibles con su icono y color de fondo.
const SERVICIOS = [
  {
    clave: 'vacunacion',
    nombre: 'Vacunación',
    descripcion: 'Protección completa con el esquema actualizado',
    icono: 'bi-capsule',
    colorClase: 'bg-primary-subtle text-primary',
  },
  {
    clave: 'consulta',
    nombre: 'Consulta General',
    descripcion: 'Revisión médica especializada por veterinario',
    icono: 'bi-heart-pulse',
    colorClase: 'bg-success-subtle text-success',
  },
  {
    clave: 'peluqueria',
    nombre: 'Peluquería',
    descripcion: 'Corte, peinado y estilismo profesional',
    icono: 'bi-scissors',
    colorClase: 'bg-primary-subtle text-primary',
  },
  {
    clave: 'grooming',
    nombre: 'Baño y Grooming',
    descripcion: 'Higiene y cuidado integral para tu mascota',
    icono: 'bi-droplet',
    colorClase: 'bg-warning-subtle text-warning-emphasis',
  },
]

export default function ServiciosPage() {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [servicioSel, setServicioSel] = useState('vacunacion')
  const [mascotaSel, setMascotaSel] = useState('1')
  const [profesionalSel, setProfesionalSel] = useState('1')
  const [fecha, setFecha] = useState('2026-09-08')
  const [hora, setHora] = useState('09:00')

  function abrirReserva(claveServicio) {
    setServicioSel(claveServicio)
    setModalAbierto(true)
  }

  function confirmarCita() {
    setModalAbierto(false)
    toast.success('Cita reservada correctamente')
  }

  return (
    <div>
      <p className="text-muted small mb-4">
        Selecciona un servicio para reservar tu cita
      </p>

      <div className="row g-3">
        {SERVICIOS.map((servicio) => (
          <div key={servicio.clave} className="col-md-6">
            <div className="card border-0 shadow-sm p-4 rounded-4">
              <div
                className={`${servicio.colorClase} rounded-circle d-flex align-items-center justify-content-center mb-3 sicvet-inline-style-018`}
              >
                <i className={`bi ${servicio.icono} fs-5`} />
              </div>
              <h6 className="fw-bold">{servicio.nombre}</h6>
              <p className="text-muted small mb-4">{servicio.descripcion}</p>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm rounded-pill w-100 py-2 fw-medium"
                onClick={() => abrirReserva(servicio.clave)}
              >
                Reservar Cita
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL RESERVAR CITA */}
      <BootstrapModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Reservar Cita</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setModalAbierto(false)}
            aria-label="Cerrar"
          />
        </div>

        <div className="modal-body py-3">
          <form>
            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                SELECCIONAR MASCOTA
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={mascotaSel}
                onChange={(e) => setMascotaSel(e.target.value)}
              >
                <option value="1">Luna (Perro - Golden Retriever)</option>
                <option value="2">Mimi (Gato - Persa)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                SERVICIO
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={servicioSel}
                onChange={(e) => setServicioSel(e.target.value)}
              >
                <option value="vacunacion">Vacunación</option>
                <option value="consulta">Consulta General</option>
                <option value="peluqueria">Peluquería</option>
                <option value="grooming">Baño y Grooming</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                VETERINARIO / PROFESIONAL
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={profesionalSel}
                onChange={(e) => setProfesionalSel(e.target.value)}
              >
                <option value="1">Dr. Alejandro Rivas</option>
                <option value="2">Dra. Valentina Suárez</option>
                <option value="3">Marcos Delgado</option>
              </select>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                  FECHA
                </label>
                <input
                  type="date"
                  className="form-control border rounded-3 shadow-none"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                  HORA
                </label>
                <select
                  className="form-select border rounded-3 shadow-none"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer border-0 pt-0 d-flex gap-2">
          <button
            type="button"
            className="btn btn-light rounded-pill px-4 border flex-grow-1 text-secondary"
            onClick={() => setModalAbierto(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-pill px-4 flex-grow-1 fw-medium"
            onClick={confirmarCita}
          >
            Confirmar Cita
          </button>
        </div>
      </BootstrapModal>
    </div>
  )
}
