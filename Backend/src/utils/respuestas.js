// ============================================================
// RESPUESTAS HTTP UNIFORMES
// ============================================================
// Todas las rutas responden con la misma estructura:
//   éxito:  { mensaje, datos? }
//   error:  { mensaje, detalles? }
// Esto simplifica el manejo de errores en el frontend.

// Envía una respuesta exitosa.
// - res: objeto Response de Express.
// - mensaje: texto descriptivo para el usuario.
// - datos: carga útil opcional (objeto, arreglo, etc.).
// - estado: código HTTP, 200 por defecto.
export function responderExito(
  res,
  mensaje,
  datos = undefined,
  estado = 200,
) {
  const cuerpo = { mensaje }

  // Solo agregamos "datos" si realmente hay contenido. Así las
  // respuestas simples quedan limpias.
  if (datos !== undefined) {
    cuerpo.datos = datos
  }

  return res.status(estado).json(cuerpo)
}

// Envía una respuesta de error.
// - detalles: información adicional opcional (por ejemplo, el campo
//   que falló la validación). No debe incluir datos sensibles.
export function responderError(
  res,
  mensaje,
  estado = 400,
  detalles = undefined,
) {
  const cuerpo = { mensaje }

  if (detalles !== undefined) {
    cuerpo.detalles = detalles
  }

  return res.status(estado).json(cuerpo)
}
