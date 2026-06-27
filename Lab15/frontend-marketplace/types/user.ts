export interface User {
  id: number;
  nombre: string;
  email: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
