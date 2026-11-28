// ============================================================
// ENCABEZADO DE PÁGINA
// ============================================================
// Título, descripción y espacio opcional para acciones (botones).

export default function PageHeader({ titulo, descripcion, children }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h4 className="fw-bold mb-1">{titulo}</h4>
        {descripcion && (
          <p className="text-secondary mb-0">{descripcion}</p>
        )}
      </div>

      {children && <div>{children}</div>}
    </div>
  )
}
