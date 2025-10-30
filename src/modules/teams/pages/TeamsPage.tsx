import { useMemo } from 'react';

import { useProjectManagement } from '../../shared/context/ProjectManagementContext';
import { PriorityLevel } from '../../shared/types/project';
import { getCollaboratorFullName } from '../../shared/utils/format';
import './TeamsPage.css';

const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: 'Baja',
  [PriorityLevel.Medium]: 'Media',
  [PriorityLevel.High]: 'Alta',
  [PriorityLevel.Critical]: 'Crítica'
};

const TeamsPage = () => {
  const { projects, collaborators } = useProjectManagement();

  const collaboratorsByRole = useMemo(
    () =>
      collaborators.reduce(
        (acc, collaborator) => {
          acc[collaborator.role] = [...(acc[collaborator.role] ?? []), collaborator];
          return acc;
        },
        {} as Record<string, typeof collaborators>
      ),
    [collaborators]
  );

  return (
    <div className="teams-page">
      <header>
        <h2>Equipos de trabajo</h2>
        <p>Consulta los colaboradores disponibles y la composición de los equipos por proyecto.</p>
      </header>

      <section className="teams-page__section">
        <h3>Colaboradores registrados</h3>
        <div className="teams-page__grid">
          {Object.entries(collaboratorsByRole).map(([role, members]) => (
            <article key={role} className="teams-card">
              <h4>{role}</h4>
              <span className="teams-card__count">{members.length} integrantes</span>
              <ul>
                {members.map((member) => (
                  <li key={member.id}>
                    <strong>
                      {member.firstName} {member.lastName}
                    </strong>
                    <span>{member.email}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="teams-page__section">
        <h3>Equipos por proyecto</h3>
        <div className="teams-page__grid">
          {projects.map((project) => (
            <article key={project.id} className="teams-card">
              <h4>{project.name}</h4>
              <p className="teams-card__focus">Prioridad {PRIORITY_LABELS[project.priority]}</p>
              <div className="teams-card__lead">
                <span>Gestor</span>
                <strong>{getCollaboratorFullName(collaborators, project.managerId)}</strong>
              </div>
              <div>
                <span>Integrantes</span>
                <ul>
                  {project.teamIds.map((memberId) => (
                    <li key={memberId}>{getCollaboratorFullName(collaborators, memberId)}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamsPage;