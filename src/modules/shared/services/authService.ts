import axios from 'axios';

import { LoginCredentials, User } from '../../auth/AuthContext';

interface LoginResponse {
  token: string;
  user: User;
}

type MockUser = User & { password: string };

const API_BASE_URL =
  (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_API_URL ??
  'http://localhost:3000/api';

const MOCK_USERS: MockUser[] = [
  {
    id: 'col-1',
    email: 'maria.lopez@empresa.com',
    name: 'María López',
    role: 'Gestor de proyecto',
    password: 'Gestor1234'
  },
  {
    id: 'col-2',
    email: 'carlos.perez@empresa.com',
    name: 'Carlos Pérez',
    role: 'Colaborador',
    password: 'Colaborador123'
  },
  {
    id: 'col-3',
    email: 'ana.gomez@empresa.com',
    name: 'Ana Gómez',
    role: 'Colaborador',
    password: 'Colaborador123'
  }
];

const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulación de un endpoint real mientras se implementa el backend.
    // Se envía la petición para mantener la estructura y facilitar el reemplazo posterior.
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      const normalizedEmail = credentials.email.trim().toLowerCase();
      const user = MOCK_USERS.find(
        (item) => item.email === normalizedEmail && item.password === credentials.password
      );

      if (user) {
        const { password, ...sessionUser } = user;
        return {
          token: 'demo-token',
          user: sessionUser
        };
      }

      throw new Error('Credenciales inválidas. Intenta nuevamente.');
    }
  },
  logout() {
    // Aquí podríamos informar al backend para invalidar el token en el futuro.
  }
};

export default authService;