/**
 * @purpose Tipos e interfaces para la API de Rick and Morty.
 * @dependencies Ninguna (tipos puros).
 * @side_effects Ninguno.
 */

/** @purpose Representa el origen del personaje (lugar de nacimiento/dimensión). */
export interface Origin {
  name: string;
  url: string;
}

/** @purpose Representa la ubicación actual del personaje. */
export interface Location {
  name: string;
  url: string;
}

/**
 * @purpose Modela todos los campos de un personaje según el Response de la API.
 *         Mapeo exhaustivo de la documentación oficial.
 * @see https://rickandmortyapi.com/documentation/#character
 */
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Origin;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

/** @purpose Metadatos de paginación incluidos en cada respuesta de lista. */
export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/**
 * @purpose Estructura completa de la respuesta del endpoint /api/character.
 *         Incluye info de paginación y array de resultados.
 */
export interface CharacterListResponse {
  info: PaginationInfo;
  results: Character[];
}