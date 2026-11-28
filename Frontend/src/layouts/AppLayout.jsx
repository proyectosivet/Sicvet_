// ============================================================
// LAYOUT DE LA APLICACIÓN
// ============================================================
// Estructura común de las pantallas privadas: sidebar, topbar y
// contenido. En móvil el sidebar se muestra como panel deslizante
// controlado con estado de React (sin depender de Bootstrap JS).

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

export default function AppLayout() {
  // Controla el menú lateral en pantallas pequeñas.
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar fijo en escritorio. */}
      <Sidebar className="d-none d-lg-flex" />

      {/* Sidebar deslizante en móvil, con fondo oscuro. */}
      {menuAbierto && (
        <>
          <div
            className="sicvet-overlay d-lg-none"
            onClick={() => setMenuAbierto(false)}
            aria-hidden="true"
          />
          <Sidebar
            className="sicvet-sidebar-movil d-lg-none"
            onNavegar={() => setMenuAbierto(false)}
          />
        </>
      )}

      {/* Columna derecha: topbar + contenido. */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        <Topbar alAbrirMenu={() => setMenuAbierto(true)} />

        <main className="flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
