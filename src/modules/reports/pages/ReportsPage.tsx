import { useMemo } from 'react';

import { useProjectManagement } from '../../shared/context/ProjectManagementContext';
import { Project, TaskStatus } from '../../shared/types/project';
import './ReportsPage.css';

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'Pendiente',
  [TaskStatus.InProgress]: 'En curso',
  [TaskStatus.InReview]: 'En revisión',
  [TaskStatus.Completed]: 'Completada'
};

const ReportsPage = () => {
  const { projects, collaborators } = useProjectManagement();

  const collaboratorsWithMultipleTasks = useMemo(() => {
    return collaborators
      .map((collaborator) => {
        const assignments: Array<{ project: Project; taskName: string; status: TaskStatus }> = [];
        projects.forEach((project) => {
          project.tasks.forEach((task) => {
            if (task.assigneeIds.includes(collaborator.id)) {
              assignments.push({ project, taskName: task.name, status: task.status });
            }
          });
        });

        return {
          collaborator,
          assignments
        };
      })
      .filter((item) => item.assignments.length > 1);
  }, [projects, collaborators]);

  const delayedProjects = useMemo(() => {
    const today = new Date();
    return projects
      .map((project) => {
        const endDate = new Date(project.endDate);
        const daysLate = Math.ceil((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
        const pendingTasks = project.tasks.filter((task) => task.status !== TaskStatus.Completed).length;

        return {
          project,
          daysLate,
          pendingTasks,
          isDelayed: project.status !== TaskStatus.Completed && daysLate > 0
        };
      })
      .filter((entry) => entry.isDelayed);
  }, [projects]);

  const taskStatusByProject = useMemo(() => {
    return projects.map((project) => {
      const counts: Record<TaskStatus, number> = {
        [TaskStatus.Pending]: 0,
        [TaskStatus.InProgress]: 0,
        [TaskStatus.InReview]: 0,
        [TaskStatus.Completed]: 0
      };

      project.tasks.forEach((task) => {
        counts[task.status] += 1;
      });

      const totalTasks = project.tasks.length || 1;

      return {
        project,
        counts,
        percentages: Object.entries(counts).map(([status, count]) => ({
          status: status as TaskStatus,
          count,
          percentage: Math.round((count / totalTasks) * 100)
        }))
      };
    });
  }, [projects]);

  return (
    <div className="reports">
      <header className="reports__header">
        <div>
          <h2>Reportes operativos</h2>
          <p>Consulta indicadores clave para la gestión de proyectos y equipos.</p>
        </div>
      </header>

      <section className="reports__section">
        <h3>Reporte de colaboradores con múltiples tareas</h3>
        {collaboratorsWithMultipleTasks.length === 0 ? (
          <p className="reports__empty">No existen colaboradores con más de una tarea asignada.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Tareas asignadas</th>
              </tr>
            </thead>
            <tbody>
              {collaboratorsWithMultipleTasks.map(({ collaborator, assignments }) => (
                <tr key={collaborator.id}>
                  <td>
                    <strong>
                      {collaborator.firstName} {collaborator.lastName}
                    </strong>
                    <span>{collaborator.email}</span>
                  </td>
                  <td>
                    <ul>
                      {assignments.map((assignment, index) => (
                        <li key={`${assignment.project.id}-${index}`}>
                          <span className={`status status--${assignment.status.toLowerCase()}`}>
                            {TASK_STATUS_LABELS[assignment.status]}
                          </span>
                          <div>
                            <strong>{assignment.taskName}</strong>
                            <span>{assignment.project.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="reports__section">
        <h3>Reporte de proyectos atrasados</h3>
        {delayedProjects.length === 0 ? (
          <p className="reports__empty">No se encontraron proyectos atrasados en el sistema.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Fecha estimada</th>
                <th>Días de atraso</th>
                <th>Tareas pendientes</th>
              </tr>
            </thead>
            <tbody>
              {delayedProjects.map(({ project, daysLate, pendingTasks }) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{new Date(project.endDate).toLocaleDateString()}</td>
                  <td>{daysLate}</td>
                  <td>{pendingTasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="reports__section">
        <h3>Reporte de avance de tareas por proyecto</h3>
        <div className="reports__grid">
          {taskStatusByProject.map(({ project, percentages }) => (
            <article key={project.id} className="reports__card">
              <header>
                <h4>{project.name}</h4>
                <span>({project.tasks.length} tareas)</span>
              </header>
              <ul>
                {percentages.map((item) => (
                  <li key={item.status}>
                    <span>{TASK_STATUS_LABELS[item.status]}</span>
                    <div className="reports__progress">
                      <div className="reports__progress-bar">
                        <div
                          className={`reports__progress-fill status--${item.status.toLowerCase()}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <strong>
                        {item.count} ({item.percentage}%)
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReportsPage;