// ============================================================
// SEED DE MASCOTAS
// ============================================================
// Cada mascota pertenece a un cliente mediante clienteId.
// Los campos coinciden con el formulario del prototipo:
// nombre, especie, raza, edad, peso y notas médicas.

const FECHA_SEED = '2026-01-20T09:30:00.000Z'

export const mascotasSeed = [
  {
    id: 1,
    clienteId: 1,
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Labrador',
    edad: 3,
    peso: 28.5,
    notas: 'Alergia leve a la hierba. Sin restricciones de comida.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 2,
    clienteId: 1,
    nombre: 'Michi',
    especie: 'Gato',
    raza: 'Criollo',
    edad: 2,
    peso: 4.2,
    notas: 'Esterilizada. Requiere control de peso.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 3,
    clienteId: 2,
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Golden Retriever',
    edad: 5,
    peso: 31.0,
    notas: 'Displasia de cadera leve.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 4,
    clienteId: 2,
    nombre: 'Simba',
    especie: 'Gato',
    raza: 'Siamés',
    edad: 4,
    peso: 5.1,
    notas: 'Vacunación al día.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 5,
    clienteId: 3,
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Bulldog Francés',
    edad: 1,
    peso: 11.8,
    notas: 'Cuidado con el calor por braquicefalia.',
    creadoEn: FECHA_SEED,
  },
  {
    id: 6,
    clienteId: 4,
    nombre: 'Nala',
    especie: 'Gato',
    raza: 'Persa',
    edad: 6,
    peso: 3.9,
    notas: 'Requiere cepillado diario.',
    creadoEn: FECHA_SEED,
  },
]
