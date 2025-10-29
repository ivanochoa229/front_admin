import axios from 'axios';

import { LoginCredentials, User } from '../../auth/AuthContext';

interface LoginResponse {
  token: string;
  user: User;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Simulación de un endpoint real mientras se implementa el backend.
    // Se envía la petición para mantener la estructura y facilitar el reemplazo posterior.
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      // Mock de respuesta cuando el backend aún no existe.
      if (credentials.email === 'demo@empresa.com' && credentials.password === 'Demo1234') {
        return {
          token: 'demo-token',
          user: {
            id: '1',
            email: credentials.email,
            name: 'Cuenta Demo'
          }
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