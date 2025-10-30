import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useProjectManagement } from '../../shared/context/ProjectManagementContext';
import { PriorityLevel } from '../../shared/types/project';
import { formatCurrency, getCollaboratorFullName } from '../../shared/utils/format';
import StatusBadge from '../components/StatusBadge';
import './ProjectsPage.css';

const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: 'Baja',
  [PriorityLevel.Medium]: 'Media',
  [PriorityLevel.High]: 'Alta',
  [PriorityLevel.Critical]: 'Crítica'
};

const ProjectsPage = () => {
  const { projects, collaborators } = useProjectManagement();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter((project) =>
      [
        project.name,
        project.description,
        getCollaboratorFullName(collaborators, project.managerId),
        PRIORITY_LABELS[project.priority]
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [projects, searchTerm, collaborators]);

  return (
    <div className="projects-page">
      <header className="projects-page__header">
        <div>
          <h2>Proyectos</h2>
          <p>Consulta el estado y los responsables de cada iniciativa.</p>
        </div>
        <div className="projects-page__actions">
          <input
            type="search"
            placeholder="Buscar por nombre, descripción, gestor o prioridad"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Link to="/projects/new" className="button">
            Crear proyecto
          </Link>
        </div>
      </header>

      <div className="projects-table__wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Avance</th>
              <th>Gestor</th>
              <th>Prioridad</th>
              <th>Presupuesto</th>
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
                <td>{getCollaboratorFullName(collaborators, project.managerId)}</td>
                <td>{PRIORITY_LABELS[project.priority]}</td>
                <td>
                  <strong>{formatCurrency(project.usedBudget)}</strong>
                  <span className="projects-table__budget">de {formatCurrency(project.budget)}</span>
                </td>
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
    </div>
  );
};

export default ProjectsPage;