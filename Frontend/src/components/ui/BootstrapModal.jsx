// ============================================================
// VENTANA EMERGENTE (MODAL)
// ============================================================
// Esta ventanita sirve para mostrar formularios o avisos encima
// de la pantalla sin tener que cambiar de página.

import { useEffect } from 'react'

export default function BootstrapModal({
  abierto,
  onCerrar,
  dialogClassName = 'sicvet-inline-style-013',
  contentClassName = 'p-3',
  children,
}) {
  // Si el usuario presiona la tecla Escape, cerramos la ventana.
  useEffect(() => {
    if (!abierto) return undefined

    function manejarTecla(evento) {
      if (evento.key === 'Escape') {
        onCerrar?.()
      }
    }

    document.addEventListener('keydown', manejarTecla)
    return () => document.removeEventListener('keydown', manejarTecla)
  }, [abierto, onCerrar])

  // Si la ventana está cerrada, no dibujamos nada en pantalla.
  if (!abierto) return null

  return (
    <>
      {/* Fondo oscuro detrás de la ventana */}
      <div className="modal-backdrop fade show" />

      {/* Si hacen clic fuera de la cajita blanca, también se cierra */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) {
            onCerrar?.()
          }
        }}
      >
        <div className={`modal-dialog modal-dialog-centered ${dialogClassName}`}>
          <div
            className={`modal-content border-0 shadow-lg rounded-4 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
