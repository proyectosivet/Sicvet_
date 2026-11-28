// ============================================================
// TOPBAR SUPERIOR
// ============================================================
// Muestra el título de la ruta actual, el usuario y el botón de
// cerrar sesión. En móvil incluye el botón para abrir el menú.

import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { iniciales } from '../../lib/formatters'
import { obtenerTituloRuta } from '../../lib/navigation'
import { etiquetaRol } from '../../lib/roles'

export default function Topbar({ alAbrirMenu }) {
  const { usuario, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Título según la ruta y el rol (por ejemplo, "Mis citas").
  const titulo = obtenerTituloRuta(location.pathname, usuario?.rol)

  function manejarSalida() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="d-flex justify-content-between align-items-center p-3 px-4 bg-white border-bottom">
      {/* Lado izquierdo: menú móvil + título. */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-light d-lg-none"
          onClick={alAbrirMenu}
          aria-label="Abrir menú"
        >
          <i className="bi bi-list fs-4" aria-hidden="true" />
        </button>

        <h5 className="fw-bold mb-0">{titulo}</h5>
      </div>

      {/* Lado derecho: usuario + salir. */}
      <div className="d-flex align-items-center gap-3">
        <div className="d-none d-md-block text-end">
          <p className="fw-bold mb-0 small">{usuario?.nombre}</p>
          <small className="text-muted d-block sicvet-inline-style-008">
            {etiquetaRol(usuario?.rol)}
          </small>
        </div>

        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009">
          {iniciales(usuario?.nombre)}
        </div>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={manejarSalida}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <i className="bi bi-box-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
