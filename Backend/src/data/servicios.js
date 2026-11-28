// ============================================================
// SEED DE SERVICIOS
// ============================================================
// Catálogo de servicios ofrecidos por la veterinaria.
// "activo" permite dar de baja un servicio sin borrarlo, para no
// romper el historial de citas que lo referencian.

export const serviciosSeed = [
  {
    id: 1,
    nombre: 'Consulta veterinaria general',
    descripcion: 'Revisión general, diagnóstico y recomendaciones.',
    precio: 60000,
    duracionMin: 30,
    categoria: 'Consulta',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Vacunación',
    descripcion: 'Aplicación de vacunas según el esquema del paciente.',
    precio: 45000,
    duracionMin: 20,
    categoria: 'Prevención',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Baño y peluquería',
    descripcion: 'Baño, secado y corte básico.',
    precio: 50000,
    duracionMin: 60,
    categoria: 'Estética',
    activo: true,
  },
  {
    id: 4,
    nombre: 'Corte de uñas',
    descripcion: 'Corte y limpieza de uñas.',
    precio: 20000,
    duracionMin: 15,
    categoria: 'Estética',
    activo: true,
  },
  {
    id: 5,
    nombre: 'Desparasitación',
    descripcion: 'Desparasitación interna y externa.',
    precio: 35000,
    duracionMin: 20,
    categoria: 'Prevención',
    activo: true,
  },
  {
    id: 6,
    nombre: 'Control postoperatorio',
    descripcion: 'Seguimiento de una cirugía o procedimiento previo.',
    precio: 40000,
    duracionMin: 25,
    categoria: 'Consulta',
    activo: true,
  },
]
