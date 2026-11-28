// ============================================================
// PANTALLA DE CLIENTES Y MASCOTAS (ADMIN Y RECEPCIONISTA)
// ============================================================
// Aquí se puede buscar clientes, ver qué mascotas tiene cada uno,
// agregar un cliente nuevo, editar sus datos o eliminarlo.

import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import BootstrapModal from '../../components/ui/BootstrapModal'

// Clientes de ejemplo que se ven al abrir la pantalla.
const CLIENTES_INICIALES = [
  {
    id: 1,
    iniciales: 'MG',
    color: 'bg-primary',
    nombre: 'María García López',
    correo: 'maria.garcia@email.com',
    telefono: '04141234567',
    direccion: 'Av. Principal #45, Caracas',
    mascotas: ['Luna (Perro · Golden Retriever)', 'Mimi (Gato · Persa)'],
  },
  {
    id: 2,
    iniciales: 'CR',
    color: 'bg-info',
    nombre: 'Carlos Rodríguez Silva',
    correo: 'carlos.rod@email.com',
    telefono: '04167891234',
    direccion: 'Calle 8, Valencia',
    mascotas: ['Rocky (Perro · Mestizo)'],
  },
  {
    id: 3,
    iniciales: 'AM',
    color: 'bg-primary',
    nombre: 'Ana Martínez Torres',
    correo: 'ana.martinez@email.com',
    telefono: '04121357908',
    direccion: 'Urb. Los Jardines, Caracas',
    mascotas: ['Coco (Perro · Poodle)', 'Nube (Gato · Siamés)'],
  },
]

const FORM_VACIO = {
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  password: '',
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState(CLIENTES_INICIALES)
  const [busqueda, setBusqueda] = useState('')
  const [expandidoId, setExpandidoId] = useState(null)

  // Modal Nuevo Cliente
  const [modalNuevo, setModalNuevo] = useState(false)
  const [formNuevo, setFormNuevo] = useState(FORM_VACIO)

  // Offcanvas Editar Cliente
  const [clienteEditar, setClienteEditar] = useState(null)
  const [formEditar, setFormEditar] = useState(FORM_VACIO)

  // Modal Eliminar Cliente
  const [clienteEliminar, setClienteEliminar] = useState(null)

  const clientesFiltrados = clientes.filter((c) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.correo.toLowerCase().includes(q)
    )
  })

  function abrirEditar(cliente) {
    setClienteEditar(cliente)
    setFormEditar({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion || '',
      password: '',
    })
  }

  function crearCliente(evento) {
    evento.preventDefault()
    if (!formNuevo.nombre.trim() || !formNuevo.correo.trim()) {
      toast.error('Nombre y correo son obligatorios')
      return
    }
    const partes = formNuevo.nombre.trim().split(/\s+/)
    const iniciales = (
      (partes[0]?.[0] || '') + (partes[1]?.[0] || '')
    ).toUpperCase()

    setClientes((prev) => [
      ...prev,
      {
        id: Date.now(),
        iniciales: iniciales || 'CL',
        color: 'bg-primary',
        nombre: formNuevo.nombre.trim(),
        correo: formNuevo.correo.trim(),
        telefono: formNuevo.telefono.trim() || 'Sin teléfono',
        direccion: formNuevo.direccion.trim(),
        mascotas: [],
      },
    ])
    setFormNuevo(FORM_VACIO)
    setModalNuevo(false)
    toast.success('Cliente creado correctamente')
  }

  function guardarEdicion() {
    if (!clienteEditar) return
    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteEditar.id
          ? {
              ...c,
              nombre: formEditar.nombre,
              correo: formEditar.correo,
              telefono: formEditar.telefono,
              direccion: formEditar.direccion,
            }
          : c,
      ),
    )
    setClienteEditar(null)
    toast.success('Cambios guardados')
  }

  function confirmarEliminacion() {
    if (!clienteEliminar) return
    setClientes((prev) => prev.filter((c) => c.id !== clienteEliminar.id))
    setClienteEliminar(null)
    toast.success('Cliente eliminado')
  }

  return (
    <div>
      {/* Buscador y Botón Nuevo */}
      <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-4">
        <div className="input-group bg-white rounded-pill shadow-sm border px-3 py-1 w-100">
          <span className="input-group-text bg-transparent border-0 text-muted">
            <i className="bi bi-search" />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-transparent shadow-none"
            placeholder="Buscar clientes por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4 text-nowrap fw-medium d-flex align-items-center justify-content-center gap-2"
          onClick={() => setModalNuevo(true)}
        >
          <i className="bi bi-plus-lg" /> Nuevo Cliente
        </button>
      </div>

      {/* Tabla de Clientes */}
      <div className="card border-0 shadow-sm rounded-4 p-3">
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="text-muted text-uppercase sicvet-inline-style-008">
                <th className="sicvet-inline-style-012" />
                <th>CLIENTE</th>
                <th>TELÉFONO</th>
                <th>MASCOTAS</th>
                <th className="text-end pe-3">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => {
                const abierto = expandidoId === cliente.id
                return (
                  <Fragment key={cliente.id}>
                    <tr>
                      <td className="text-muted">
                        <button
                          type="button"
                          className="btn btn-link text-muted p-0 border-0"
                          onClick={() =>
                            setExpandidoId(abierto ? null : cliente.id)
                          }
                          aria-label="Ver mascotas"
                        >
                          <i
                            className={`bi ${
                              abierto ? 'bi-chevron-down' : 'bi-chevron-right'
                            }`}
                          />
                        </button>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`${cliente.color} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009`}
                          >
                            {cliente.iniciales}
                          </div>
                          <div>
                            <strong>{cliente.nombre}</strong>
                            <br />
                            <small className="text-muted">
                              {cliente.correo}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">{cliente.telefono}</td>
                      <td className="text-secondary">
                        {cliente.mascotas.length}{' '}
                        {cliente.mascotas.length === 1 ? 'mascota' : 'mascotas'}
                      </td>
                      <td className="text-end pe-3">
                        <button
                          type="button"
                          className="btn btn-link text-muted p-0 me-3 border-0"
                          onClick={() => abrirEditar(cliente)}
                          aria-label={`Editar ${cliente.nombre}`}
                        >
                          <i className="bi bi-pencil fs-6" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-link text-muted p-0 border-0"
                          onClick={() => setClienteEliminar(cliente)}
                          aria-label={`Eliminar ${cliente.nombre}`}
                        >
                          <i className="bi bi-trash fs-6" />
                        </button>
                      </td>
                    </tr>
                    {abierto && (
                      <tr className="bg-light">
                        <td colSpan={5} className="ps-5 py-2">
                          <small className="text-muted fw-semibold d-block mb-1">
                            Mascotas registradas:
                          </small>
                          {cliente.mascotas.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                              {cliente.mascotas.map((m) => (
                                <span
                                  key={m}
                                  className="badge bg-white text-secondary border rounded-pill px-3 py-1 fw-normal"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <small className="text-muted">
                              Sin mascotas registradas
                            </small>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NUEVO CLIENTE */}
      <BootstrapModal
        abierto={modalNuevo}
        onCerrar={() => setModalNuevo(false)}
      >
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">Nuevo Cliente</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setModalNuevo(false)}
            aria-label="Cerrar"
          />
        </div>

        <form onSubmit={crearCliente}>
          <div className="modal-body py-3">
            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                NOMBRE COMPLETO
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-person" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="Nombre del cliente"
                  value={formNuevo.nombre}
                  onChange={(e) =>
                    setFormNuevo((f) => ({ ...f, nombre: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                CORREO ELECTRÓNICO
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="email"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="correo@email.com"
                  value={formNuevo.correo}
                  onChange={(e) =>
                    setFormNuevo((f) => ({ ...f, correo: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                TELÉFONO
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-telephone" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="04XX-XXXXXXX"
                  value={formNuevo.telefono}
                  onChange={(e) =>
                    setFormNuevo((f) => ({ ...f, telefono: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                DIRECCIÓN
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-geo-alt" />
                </span>
                <input
                  type="text"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="Ciudad, dirección"
                  value={formNuevo.direccion}
                  onChange={(e) =>
                    setFormNuevo((f) => ({ ...f, direccion: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                CONTRASEÑA TEMPORAL
              </label>
              <div className="input-group rounded-3 border">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <i className="bi bi-lock" />
                </span>
                <input
                  type="password"
                  className="form-control border-0 shadow-none ps-0"
                  placeholder="Contraseña provisional"
                  value={formNuevo.password}
                  onChange={(e) =>
                    setFormNuevo((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer border-0 pt-0 d-flex gap-2">
            <button
              type="button"
              className="btn btn-light rounded-pill px-4 border flex-grow-1 text-secondary"
              onClick={() => setModalNuevo(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 flex-grow-1 fw-medium"
            >
              Crear Cliente
            </button>
          </div>
        </form>
      </BootstrapModal>

      {/* PANEL LATERAL DERECHO (EDITAR CLIENTE) */}
      {clienteEditar && (
        <>
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setClienteEditar(null)}
          />
          <div
            className="offcanvas offcanvas-end show border-0 shadow-lg sicvet-inline-style-014"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="offcanvas-header p-4 pb-0">
              <h5 className="offcanvas-title fw-bold">Editar Cliente</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setClienteEditar(null)}
                aria-label="Cerrar"
              />
            </div>

            <div className="offcanvas-body p-4 d-flex flex-column justify-content-between">
              <form>
                <div className="mb-3">
                  <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                    NOMBRE COMPLETO
                  </label>
                  <div className="input-group bg-light rounded-3 border">
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="bi bi-person" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-0 shadow-none ps-0"
                      value={formEditar.nombre}
                      onChange={(e) =>
                        setFormEditar((f) => ({ ...f, nombre: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                    CORREO
                  </label>
                  <div className="input-group bg-light rounded-3 border">
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="bi bi-envelope" />
                    </span>
                    <input
                      type="email"
                      className="form-control bg-transparent border-0 shadow-none ps-0"
                      value={formEditar.correo}
                      onChange={(e) =>
                        setFormEditar((f) => ({ ...f, correo: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                    TELÉFONO
                  </label>
                  <div className="input-group bg-light rounded-3 border">
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="bi bi-telephone" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-0 shadow-none ps-0"
                      value={formEditar.telefono}
                      onChange={(e) =>
                        setFormEditar((f) => ({
                          ...f,
                          telefono: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-uppercase text-secondary fw-bold sicvet-inline-style-008">
                    DIRECCIÓN
                  </label>
                  <div className="input-group bg-light rounded-3 border">
                    <span className="input-group-text bg-transparent border-0 text-muted">
                      <i className="bi bi-geo-alt" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent border-0 shadow-none ps-0"
                      value={formEditar.direccion}
                      onChange={(e) =>
                        setFormEditar((f) => ({
                          ...f,
                          direccion: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </form>

              <div className="pt-3">
                <button
                  type="button"
                  className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
                  onClick={guardarEdicion}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL ELIMINAR CLIENTE */}
      <BootstrapModal
        abierto={Boolean(clienteEliminar)}
        onCerrar={() => setClienteEliminar(null)}
        dialogClassName="sicvet-inline-style-046"
        contentClassName="p-4 text-center"
      >
        <div className="modal-body p-0">
          <div className="bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3 sicvet-inline-style-047">
            <i className="bi bi-exclamation-triangle fs-3" />
          </div>

          <h5 className="fw-bold text-dark mb-2">¿Eliminar cliente?</h5>
          <p className="text-muted small mb-4">
            Esta acción eliminará también las mascotas y citas asociadas. Es
            irreversible.
          </p>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-50 rounded-3 fw-semibold py-2"
              onClick={() => setClienteEliminar(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger w-50 rounded-3 fw-semibold py-2"
              onClick={confirmarEliminacion}
            >
              Eliminar
            </button>
          </div>
        </div>
      </BootstrapModal>
    </div>
  )
}
