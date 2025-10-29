import { Link } from 'react-router-dom';

import { Project } from '../../shared/types/project';
import StatusBadge from './StatusBadge';
import './ProjectSummary.css';

interface ProjectSummaryProps {
  project: Project;
}

const ProjectSummary = ({ project }: ProjectSummaryProps) => (
  <article className="project-summary">
    <header>
      <h3>{project.name}</h3>
      <StatusBadge status={project.status} />
    </header>
    <p className="project-summary__description">{project.description}</p>
    <div className="project-summary__progress">
      <span>Avance</span>
      <div className="progress-bar">
        <div className="progress-bar__fill" style={{ width: `${project.progress}%` }} />
      </div>
      <span className="project-summary__progress-value">{project.progress}%</span>
    </div>
    <footer>
      <div>
        <strong>Gestor:</strong> {project.manager}
      </div>
      <Link to={`/projects/${project.id}`} className="link">
        Ver detalle
      </Link>
    </footer>
  </article>
);

export default ProjectSummary;