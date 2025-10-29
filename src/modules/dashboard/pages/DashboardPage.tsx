import { useEffect, useState } from 'react';

import projectService from '../../shared/services/projectService';
import { Project } from '../../shared/types/project';
import ProjectSummary from '../../projects/components/ProjectSummary';
import StatsCard from '../components/StatsCard';
import './DashboardPage.css';

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await projectService.getProjects();
      setProjects(data);
    };

    void loadProjects();
  }, []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((project) => project.progress === 100).length;
  const activeProjects = projects.filter((project) => project.progress < 100).length;
  const averageProgress = totalProjects
    ? Math.round(projects.reduce((acc, project) => acc + project.progress, 0) / totalProjects)
    : 0;

  return (
    <div className="dashboard-page">
      <section className="dashboard-page__section">
        <h2>Resumen general</h2>
        <div className="dashboard-page__stats">
          <StatsCard title="Proyectos totales" value={totalProjects} trend="+2 respecto al mes pasado" />
          <StatsCard
            title="Proyectos activos"
            value={activeProjects}
            trend="Incluye proyectos planificados y en progreso"
          />
          <StatsCard title="Completados" value={completedProjects} trend="Objetivo trimestral 80%" />
          <StatsCard title="Avance promedio" value={`${averageProgress}%`} trend="Promedio ponderado" />
        </div>
      </section>

      <section className="dashboard-page__section">
        <header className="dashboard-page__section-header">
          <div>
            <h2>Proyectos destacados</h2>
            <p>Una vista rápida del estado de los proyectos en curso.</p>
          </div>
        </header>
        <div className="dashboard-page__projects-grid">
          {projects.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;