export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string; 
}

export type AuthUser = User | null;

export interface AuthResponse {
  user: User;
}