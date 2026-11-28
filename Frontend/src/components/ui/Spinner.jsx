// ============================================================
// SPINNER DE CARGA
// ============================================================
// Componente reutilizable para indicar que hay una operación en
// curso. Puede ocupar toda la pantalla o solo una sección.

export default function Spinner({
  mensaje = 'Cargando...',
  pantallaCompleta = false,
}) {
  const contenido = (
    <div className="d-flex flex-column align-items-center gap-2 text-secondary">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{mensaje}</span>
      </div>
      <span className="small">{mensaje}</span>
    </div>
  )

  // Variante de pantalla completa (verificación de sesión).
  if (pantallaCompleta) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        {contenido}
      </div>
    )
  }

  // Variante para una sección concreta.
  return <div className="py-5">{contenido}</div>
}
