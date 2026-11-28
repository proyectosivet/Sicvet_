// ============================================================
// PANTALLA DE MIS MASCOTAS (ROL CLIENTE)
// ============================================================
// Muestra las tarjetas de cada mascota del cliente y una tarjeta
// con borde punteado para agregar una nueva mascota.

import { useState } from 'react'
import { toast } from 'sonner'
import BootstrapModal from '../../components/ui/BootstrapModal'

// Mascotas de ejemplo con las que arranca la vista.
const MASCOTAS_INICIALES = [
  {
    id: 1,
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Golden Retriever',
    edad: 3,
    peso: 28,
    notas: 'Alérgica a ciertos alimentos. Última vacuna: Marzo 2024.',
  },
  {
    id: 2,
    nombre: 'Mimi',
    especie: 'Gato',
    raza: 'Persa',
    edad: 5,
    peso: 4,
    notas: 'Tratamiento dental en curso.',
  },
]

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Otro']

const FORM_INICIAL = {
  nombre: '',
  especie: 'Perro',
  raza: '',
  edad: 3,
  peso: 12,
  notas: '',
}

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState(MASCOTAS_INICIALES)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)

  function abrirNueva() {
    setEditandoId(null)
    setForm(FORM_INICIAL)
    setModalAbierto(true)
  }

  function abrirEditar(mascota) {
    setEditandoId(mascota.id)
    setForm({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      edad: mascota.edad,
      peso: mascota.peso,
      notas: mascota.notas,
    })
    setModalAbierto(true)
  }

  function eliminarMascota(id) {
    setMascotas((prev) => prev.filter((m) => m.id !== id))
    toast.success('Mascota eliminada')
  }

  function guardarMascota() {
    if (!form.nombre.trim()) {
      toast.error('Ingresa el nombre de la mascota')
      return
    }

    if (editandoId) {
      setMascotas((prev) =>
        prev.map((m) => (m.id === editandoId ? { ...m, ...form } : m)),
      )
      toast.success('Mascota actualizada')
    } else {
      setMascotas((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          raza: form.raza.trim() || 'Mestizo',
        },
      ])
      toast.success('Mascota agregada')
    }

    setModalAbierto(false)
  }

  return (
    <div>
      <div className="row g-3">
        {mascotas.map((mascota) => (
          <div key={mascota.id} className="col-md-4">
            <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center sicvet-inline-style-018">
                  <i className="bi bi-heart-pulse fs-5" />
                </div>
                <div className="text-muted small">
                  <button
                    type="button"
                    className="btn btn-link text-muted p-0 me-2 border-0"
                    onClick={() => abrirEditar(mascota)}
                    aria-label={`Editar ${mascota.nombre}`}
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-muted p-0 border-0"
                    onClick={() => eliminarMascota(mascota.id)}
                    aria-label={`Eliminar ${mascota.nombre}`}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
              <h6 className="fw-bold mb-1">{mascota.nombre}</h6>
              <p className="text-muted small mb-1">
                {mascota.raza} · {mascota.especie}
              </p>
              <p className="text-muted small mb-3">
                {mascota.edad} años · {mascota.peso} kg
              </p>
              <p className="text-muted mb-0 sicvet-inline-style-008">
                {mascota.notas || 'Sin notas médicas registradas.'}
              </p>
            </div>
          </div>
        ))}

        {/* Tarjeta Botón para Agregar Mascota */}
        <div className="col-md-4">
          <div
            role="button"
            tabIndex={0}
            className="card border-2 border-secondary-subtle rounded-4 d-flex flex-column align-items-center justify-content-center p-4 text-muted h-100 sicvet-inline-style-019"
            onClick={abrirNueva}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') abrirNueva()
            }}
          >
            <i className="bi bi-plus-lg fs-3 mb-1" />
            <span className="fw-bold small">Agregar Mascota</span>
          </div>
        </div>
      </div>

      {/* MODAL AGREGAR / EDITAR MASCOTA */}
      <BootstrapModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">
            {editandoId ? 'Editar Mascota' : 'Agregar Mascota'}
          </h5>
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
                NOMBRE
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-heart" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="Ej: Firulais"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nombre: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold d-block sicvet-inline-style-008">
                ESPECIE
              </label>
              <div className="btn-group w-100" role="group">
                {ESPECIES.map((esp, idx) => {
                  const id = `esp-${esp}`
                  const radiusClass =
                    idx === 0
                      ? 'rounded-start-3'
                      : idx === ESPECIES.length - 1
                        ? 'rounded-end-3'
                        : ''
                  return (
                    <span key={esp} className="flex-fill d-flex">
                      <input
                        type="radio"
                        className="btn-check"
                        name="especie"
                        id={id}
                        checked={form.especie === esp}
                        onChange={() =>
                          setForm((f) => ({ ...f, especie: esp }))
                        }
                      />
                      <label
                        className={`btn btn-outline-primary w-100 py-2 fw-medium ${radiusClass}`}
                        htmlFor={id}
                      >
                        {esp}
                      </label>
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                RAZA
              </label>
              <div className="input-group rounded-3 border">
                <input
                  type="text"
                  className="form-control border-0 shadow-none px-3"
                  placeholder="Ej: Golden Retriever"
                  value={form.raza}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, raza: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                  EDAD (AÑOS)
                </label>
                <input
                  type="number"
                  className="form-control border rounded-3 shadow-none px-3"
                  value={form.edad}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, edad: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="col-6">
                <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                  PESO (KG)
                </label>
                <input
                  type="number"
                  className="form-control border rounded-3 shadow-none px-3"
                  value={form.peso}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, peso: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                NOTAS MÉDICAS
              </label>
              <textarea
                className="form-control border rounded-3 shadow-none"
                rows={3}
                placeholder="Alergias, condiciones especiales..."
                value={form.notas}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notas: e.target.value }))
                }
              />
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
            onClick={guardarMascota}
          >
            Guardar Mascota
          </button>
        </div>
      </BootstrapModal>
    </div>
  )
}
