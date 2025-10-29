import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import projectService from '../../shared/services/projectService';
import { Project } from '../../shared/types/project';
import StatusBadge from '../components/StatusBadge';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        return;
      }

      const data = await projectService.getProjectById(projectId);
      if (!data) {
        navigate('/projects', { replace: true });
        return;
      }

      setProject(data);
    };

    void loadProject();
  }, [projectId, navigate]);

  if (!project) {
    return <p>Cargando información del proyecto...</p>;
  }

  return (
    <div className="project-detail">
      <header className="project-detail__header">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <section className="project-detail__section">
        <h3>Información general</h3>
        <div className="project-detail__grid">
          <div>
            <span>Gestor responsable</span>
            <strong>{project.manager}</strong>
          </div>
          <div>
            <span>Fechas</span>
            <strong>
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </strong>
          </div>
          <div>
            <span>Progreso actual</span>
            <strong>{project.progress}%</strong>
          </div>
        </div>
      </section>

      <section className="project-detail__section">
        <h3>Equipo asignado</h3>
        <ul>
          {project.team.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProjectDetailPage;