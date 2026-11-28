// ============================================================
// PÁGINA DE RECUPERACIÓN DE CONTRASEÑA
// ============================================================
// Envía el correo a POST /api/auth/recuperar. El backend simula el
// envío y responde siempre de forma genérica para no revelar si el
// correo existe.
//
// La pantalla de restablecimiento queda pendiente para una fase
// posterior, tal como se acordó.

import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import AuthLayout from '../../layouts/AuthLayout'
import { api } from '../../lib/api'
import { esCorreoValido, esTextoRequerido } from '../../lib/validators'

export default function RecuperarPage() {
  const { usuario } = useAuth()

  // -------------------- Estado --------------------
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesión, no tiene sentido recuperar la contraseña.
  if (usuario) {
    return <Navigate to="/dashboard" replace />
  }

  // -------------------- Envío --------------------
  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviado(false)

    const correoLimpio = correo.trim()

    if (!esTextoRequerido(correoLimpio)) {
      setError('Ingresa tu correo electrónico')
      return
    }

    if (!esCorreoValido(correoLimpio)) {
      setError('Ingresa un correo electrónico válido')
      return
    }

    setEnviando(true)

    try {
      await api.post('/auth/recuperar', { correo: correoLimpio })
      setEnviado(true)
    } catch (fallo) {
      setError(fallo.mensaje || 'No se pudo procesar la solicitud')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout titulo="Recuperar Contraseña">
      <p className="text-secondary small mb-4">
        Ingresa el correo electrónico asociado a tu cuenta para
        solicitar un enlace de recuperación.
      </p>

      <form onSubmit={manejarEnvio} noValidate>
        {/* -------------------- Correo -------------------- */}
        <div className="mb-4">
          <label
            htmlFor="correo"
            className="form-label text-secondary fw-semibold small text-uppercase"
          >
            Correo electrónico
          </label>

          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-secondary ps-3">
              <i className="bi bi-envelope" aria-hidden="true" />
            </span>

            <input
              id="correo"
              type="email"
              className="form-control border-start-0 ps-0"
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              autoFocus
              value={correo}
              onChange={(evento) => {
                setCorreo(evento.target.value)
                // Al editar, limpiamos mensajes anteriores.
                setError('')
                setEnviado(false)
              }}
            />
          </div>
        </div>

        {/* -------------------- Error -------------------- */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            <i
              className="bi bi-exclamation-circle me-2"
              aria-hidden="true"
            />
            {error}
          </div>
        )}

        {/* -------------------- Confirmación -------------------- */}
        {enviado && (
          <div className="alert alert-info py-2 small" role="status">
            <i className="bi bi-info-circle me-2" aria-hidden="true" />
            Si el correo está registrado, recibirás un enlace de
            recuperación. El envío de correos es simulado en esta
            versión.
          </div>
        )}

        {/* -------------------- Botón -------------------- */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2 rounded-3 fw-semibold fs-6 d-flex align-items-center justify-content-center gap-2"
          disabled={enviando}
        >
          {enviando ? (
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            />
          ) : (
            <i className="bi bi-envelope-check" aria-hidden="true" />
          )}
          Enviar enlace de recuperación
        </button>

        {/* -------------------- Volver -------------------- */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-decoration-none small fw-semibold"
          >
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Volver al inicio de sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
