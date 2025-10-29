import { FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../AuthContext';
import './LoginPage.css';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const LoginPage = () => {
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('demo@empresa.com');
  const [password, setPassword] = useState('Demo1234');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login({ email, password });
  };

  const from = (location.state as LocationState | null)?.from?.pathname ?? '/';

  return (
    <div className="login-page">
      <div className="login-card">
        <header>
          <h1>Gestión de Proyectos</h1>
          <p>Inicia sesión para acceder al panel administrativo.</p>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        <footer>
          <small>
            Serás redirigido a: <strong>{from}</strong>
          </small>
          <small>Utiliza la cuenta demo para explorar el sistema.</small>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;