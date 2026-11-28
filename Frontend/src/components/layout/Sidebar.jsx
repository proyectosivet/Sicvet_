// ============================================================
// SIDEBAR LATERAL
// ============================================================
// Menú de navegación filtrado por rol. Se reutiliza tanto en
// escritorio (fijo) como en móvil (deslizante).

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { NOMBRE_APP } from '../../lib/constants'
import { iniciales } from '../../lib/formatters'
import { obtenerMenu } from '../../lib/navigation'
import { etiquetaRol, ROLES } from '../../lib/roles'

export default function Sidebar({ className = '', onNavegar }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  // Opciones visibles según el rol del usuario.
  const menu = obtenerMenu(usuario?.rol)

  // Cierra la sesión y vuelve al login.
  function manejarSalida() {
    logout()
    // Cerramos el menú móvil si estaba abierto.
    onNavegar?.()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`sicvet-sidebar bg-white border-end flex-column justify-content-between p-3 ${className}`}
    >
      {/* -------------------- Encabezado -------------------- */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-4 px-2">
          <div className="rounded-3 d-flex align-items-center justify-content-center p-1 shadow-sm overflow-hidden sicvet-inline-style-007">
            <img
              src="/assets/dashboard/img/logo.png"
              alt="Logo SICVET"
              className="img-fluid w-100 h-100 object-fit-contain"
            />
          </div>
          <div>
            <h6 className="fw-bold mb-0">{NOMBRE_APP}</h6>
            <small className="text-muted d-block sicvet-inline-style-008">
              {usuario?.rol === ROLES.PELUQUERO
                ? 'Gestión de Peluquería'
                : 'Gestión Veterinaria'}
            </small>
          </div>
        </div>

        {/* -------------------- Menú -------------------- */}
        <nav className="nav nav-pills flex-column gap-1">
          {menu.map((item) => (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              end
              onClick={onNavegar}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 ${
                  isActive ? 'active' : 'text-secondary'
                }`
              }
            >
              <i className={`bi ${item.icono}`} aria-hidden="true" />
              <span>{item.etiqueta}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* -------------------- Pie: sesión -------------------- */}
      <div className="pt-3 border-top">
        <NavLink
          to="/perfil"
          onClick={onNavegar}
          className={({ isActive }) =>
            `text-decoration-none d-flex align-items-center gap-2 mb-2 small px-2 ${
              isActive ? 'text-primary fw-semibold' : 'text-secondary'
            }`
          }
        >
          <i className="bi bi-person" aria-hidden="true" />
          Mi Perfil
        </NavLink>

        <button
          type="button"
          className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-2 mb-3 small px-2"
          onClick={manejarSalida}
        >
          <i className="bi bi-box-arrow-left" aria-hidden="true" />
          Cerrar sesión
        </button>

        <div className="d-flex align-items-center gap-2 px-2">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold sicvet-inline-style-009">
            {iniciales(usuario?.nombre)}
          </div>
          <div className="overflow-hidden">
            <p className="fw-bold mb-0 small text-truncate">
              {usuario?.nombre}
            </p>
            <small className="text-muted d-block sicvet-inline-style-008">
              {etiquetaRol(usuario?.rol)}
            </small>
          </div>
        </div>
      </div>
    </aside>
  )
}
