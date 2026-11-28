// ============================================================
// PANTALLA PARA AGENDAR UNA NUEVA CITA
// ============================================================
// Formulario centrado con encabezado azul para elegir cliente,
// mascota, servicio, profesional, fecha y hora. Al enviar, muestra
// un aviso de "¡Cita asignada!".

import { useState } from 'react'
import BootstrapModal from '../../components/ui/BootstrapModal'
import { useAuth } from '../../context/auth-context'
import { ROLES } from '../../lib/roles'

export default function NuevaCitaPage() {
  const { usuario } = useAuth()
  const esCliente = usuario?.rol === ROLES.CLIENTE

  const [cliente, setCliente] = useState('')
  const [mascota, setMascota] = useState('')
  const [servicio, setServicio] = useState('')
  const [profesional, setProfesional] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [modalConfirmacion, setModalConfirmacion] = useState(false)

  function manejarEnvio(evento) {
    evento.preventDefault()
    setModalConfirmacion(true)
  }

  function aceptarConfirmacion() {
    setModalConfirmacion(false)
    setCliente('')
    setMascota('')
    setServicio('')
    setProfesional('')
    setFecha('')
    setHora('')
  }

  return (
    <div className="d-flex justify-content-center">
      {/* Tarjeta del Formulario */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden sicvet-inline-style-016">
        {/* Encabezado Azul de la Tarjeta */}
        <div className="bg-primary text-white p-4">
          <h5 className="fw-bold mb-1">Nueva Cita</h5>
          <p className="small mb-0 opacity-75">
            Complete los datos para agendar
          </p>
        </div>

        {/* Formulario */}
        <form className="p-4" onSubmit={manejarEnvio}>
          {!esCliente && (
            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                CLIENTE
              </label>
              <select
                className="form-select border rounded-3 shadow-none"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccionar cliente...
                </option>
                <option value="1">
                  María García López (maria.garcia@email.com)
                </option>
                <option value="2">
                  Carlos Rodríguez Silva (carlos.rod@email.com)
                </option>
                <option value="3">
                  Ana Martínez Torres (ana.martinez@email.com)
                </option>
                <option value="4">
                  Luis Hernández Pérez (luis.hd@email.com)
                </option>
              </select>
            </div>
          )}

          {/* Selección de Mascota */}
          <div className="mb-3">
            <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
              MASCOTA
            </label>
            <select
              className="form-select border rounded-3 shadow-none"
              value={mascota}
              onChange={(e) => setMascota(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccionar mascota...
              </option>
              <option value="1">Luna (Perro - Golden Retriever)</option>
              <option value="2">Mimi (Gato - Persa)</option>
              <option value="3">Rocky (Perro - Mestizo)</option>
              <option value="4">Max (Perro - Poodle)</option>
            </select>
          </div>

          {/* Selección de Servicio */}
          <div className="mb-3">
            <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
              SERVICIO
            </label>
            <select
              className="form-select border rounded-3 shadow-none"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccionar servicio...
              </option>
              <option value="1">Consulta General</option>
              <option value="2">Vacunación</option>
              <option value="3">Peluquería</option>
              <option value="4">Baño y Grooming</option>
            </select>
          </div>

          {/* Asignar Profesional */}
          <div className="mb-3">
            <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
              VETERINARIO / PERSONAL
            </label>
            <select
              className="form-select border rounded-3 shadow-none"
              value={profesional}
              onChange={(e) => setProfesional(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccionar profesional...
              </option>
              <option value="1">
                Dr. Alejandro Rivas (Medicina General)
              </option>
              <option value="2">Dra. Valentina Suárez (Cirugía)</option>
              <option value="3">Marcos Delgado (Estética Canina)</option>
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="row g-2 mb-4">
            <div className="col-6">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                FECHA
              </label>
              <input
                type="date"
                className="form-control border rounded-3 shadow-none"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
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
                required
              >
                <option value="" disabled>
                  Seleccionar hora...
                </option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:30">03:30 PM</option>
              </select>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 fw-medium"
          >
            Agendar Cita
          </button>
        </form>
      </div>

      {/* Confirmación de cita asignada */}
      <BootstrapModal
        abierto={modalConfirmacion}
        onCerrar={aceptarConfirmacion}
        dialogClassName="sicvet-inline-style-046"
        contentClassName="p-4 text-center"
      >
        <div className="modal-body p-0">
          <div className="bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3 sicvet-inline-style-048">
            <i className="bi bi-check-lg fs-2" />
          </div>
          <h5 className="fw-bold text-dark mb-2">¡Cita asignada!</h5>
          <p className="text-muted small mb-4">
            La cita se ha confirmado correctamente.
          </p>
          <button
            type="button"
            className="btn btn-primary w-100 rounded-3 fw-semibold py-2"
            onClick={aceptarConfirmacion}
          >
            Aceptar
          </button>
        </div>
      </BootstrapModal>
    </div>
  )
}
