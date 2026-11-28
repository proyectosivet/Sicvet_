// ============================================================
// FORMULARIO DE DATOS PERSONALES
// ============================================================
// Actualiza nombre, correo, teléfono y dirección. Usa la función
// actualizarPerfil de AuthContext para que el sidebar y el topbar
// reflejen los cambios inmediatamente.

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../../context/auth-context'
import { esCorreoValido, esTextoRequerido } from '../../../lib/validators'

export default function PerfilForm() {
  const { usuario, actualizarPerfil } = useAuth()

  // Copiamos los datos actuales al estado local del formulario.
  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [correo, setCorreo] = useState(usuario?.correo || '')
  const [telefono, setTelefono] = useState(usuario?.telefono || '')
  const [direccion, setDireccion] = useState(usuario?.direccion || '')

  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    // Validaciones locales antes de llamar a la API.
    if (!esTextoRequerido(nombre) || !esTextoRequerido(correo)) {
      setError('Nombre y correo son obligatorios')
      return
    }

    if (!esCorreoValido(correo)) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    setGuardando(true)

    try {
      await actualizarPerfil({ nombre, correo, telefono, direccion })
      toast.success('Perfil actualizado correctamente')
    } catch (fallo) {
      setError(fallo.mensaje || 'No se pudo actualizar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Datos personales</h6>

        <form onSubmit={manejarEnvio} noValidate>
          {/* Nombre */}
          <div className="mb-3">
            <label
              htmlFor="perfil-nombre"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Nombre completo
            </label>
            <input
              id="perfil-nombre"
              type="text"
              className="form-control"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label
              htmlFor="perfil-correo"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Correo electrónico
            </label>
            <input
              id="perfil-correo"
              type="email"
              className="form-control"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              autoComplete="email"
            />
          </div>

          {/* Teléfono */}
          <div className="mb-3">
            <label
              htmlFor="perfil-telefono"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Teléfono
            </label>
            <input
              id="perfil-telefono"
              type="tel"
              className="form-control"
              value={telefono}
              onChange={(evento) => setTelefono(evento.target.value)}
              autoComplete="tel"
            />
          </div>

          {/* Dirección */}
          <div className="mb-3">
            <label
              htmlFor="perfil-direccion"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Dirección
            </label>
            <input
              id="perfil-direccion"
              type="text"
              className="form-control"
              value={direccion}
              onChange={(evento) => setDireccion(evento.target.value)}
              autoComplete="street-address"
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary d-flex align-items-center gap-2"
            disabled={guardando}
          >
            {guardando ? (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
            ) : (
              <i className="bi bi-save" aria-hidden="true" />
            )}
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
