// ============================================================
// FORMULARIO DE CAMBIO DE CONTRASEÑA
// ============================================================
// Pide la contraseña actual, la nueva y su confirmación. El
// backend verifica la actual y guarda el hash de la nueva.

import { useState } from 'react'
import { toast } from 'sonner'
import { cambiarPassword } from '../perfil.api'
import { esTextoRequerido, minimoCaracteres } from '../../../lib/validators'

export default function CambiarPasswordForm() {
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    // Validaciones locales.
    if (
      !esTextoRequerido(passwordActual) ||
      !esTextoRequerido(passwordNueva)
    ) {
      setError('Completa todos los campos')
      return
    }

    if (!minimoCaracteres(passwordNueva, 6)) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (passwordNueva !== confirmar) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    setGuardando(true)

    try {
      await cambiarPassword({ passwordActual, passwordNueva })
      toast.success('Contraseña actualizada correctamente')

      // Limpiamos el formulario tras el cambio.
      setPasswordActual('')
      setPasswordNueva('')
      setConfirmar('')
    } catch (fallo) {
      setError(fallo.mensaje || 'No se pudo cambiar la contraseña')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Cambiar contraseña</h6>

        <form onSubmit={manejarEnvio} noValidate>
          {/* Contraseña actual */}
          <div className="mb-3">
            <label
              htmlFor="password-actual"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Contraseña actual
            </label>
            <input
              id="password-actual"
              type="password"
              className="form-control"
              value={passwordActual}
              onChange={(evento) => setPasswordActual(evento.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Nueva contraseña */}
          <div className="mb-3">
            <label
              htmlFor="password-nueva"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Nueva contraseña
            </label>
            <input
              id="password-nueva"
              type="password"
              className="form-control"
              value={passwordNueva}
              onChange={(evento) => setPasswordNueva(evento.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Confirmación */}
          <div className="mb-3">
            <label
              htmlFor="password-confirmar"
              className="form-label text-secondary fw-semibold small text-uppercase"
            >
              Confirmar nueva contraseña
            </label>
            <input
              id="password-confirmar"
              type="password"
              className="form-control"
              value={confirmar}
              onChange={(evento) => setConfirmar(evento.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            disabled={guardando}
          >
            {guardando ? (
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              />
            ) : (
              <i className="bi bi-shield-lock" aria-hidden="true" />
            )}
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  )
}
