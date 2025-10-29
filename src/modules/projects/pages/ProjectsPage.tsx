import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import projectService from '../../shared/services/projectService';
import { Project } from '../../shared/types/project';
import StatusBadge from '../components/StatusBadge';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      const data = await projectService.getProjects();
      setProjects(data);
    };

    void loadProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter((project) =>
      [project.name, project.description, project.manager].some((value) => value.toLowerCase().includes(term))
    );
  }, [projects, searchTerm]);

  return (
    <div className="projects-page">
      <header className="projects-page__header">
        <div>
          <h2>Proyectos</h2>
          <p>Consulta el estado y los responsables de cada iniciativa.</p>
        </div>
        <input
          type="search"
          placeholder="Buscar por nombre, descripción o gestor"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </header>

      <table className="projects-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Avance</th>
            <th>Gestor</th>
            <th>Fechas</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project.id}>
              <td>
                <strong>{project.name}</strong>
                <p>{project.description}</p>
              </td>
              <td>
                <StatusBadge status={project.status} />
              </td>
              <td>
                <div className="projects-table__progress">
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span>{project.progress}%</span>
                </div>
              </td>
              <td>{project.manager}</td>
              <td>
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </td>
              <td>
                <Link to={`/projects/${project.id}`} className="link">
                  Ver más
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsPage;