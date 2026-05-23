export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse {
  info: ApiInfo;
  results: Character[];
}
