import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './AppLayout.css';

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div>
          <h1>Gestión de Proyectos</h1>
          <span className="app-header__subtitle">Panel administrativo</span>
        </div>
        <div className="app-header__user">
          <span>{user?.name}</span>
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <div className="app-body">
        <nav className="app-nav">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/projects">Proyectos</NavLink>
          <NavLink to="/projects/new">Crear proyecto</NavLink>
          <NavLink to="/teams">Equipos</NavLink>
          <NavLink to="/reports">Reportes</NavLink>
          <NavLink to="/users/register">Usuarios</NavLink>
        </nav>
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;