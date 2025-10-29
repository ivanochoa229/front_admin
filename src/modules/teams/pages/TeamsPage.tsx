import './TeamsPage.css';

const TEAMS = [
  {
    name: 'Innovación Digital',
    lead: 'María López',
    members: ['María López', 'Carlos Pérez', 'Ana Gómez', 'Diego Torres'],
    focus: 'Implementación de nuevas soluciones tecnológicas y automatización de procesos.'
  },
  {
    name: 'Experiencia de Cliente',
    lead: 'Luis Rodríguez',
    members: ['Luis Rodríguez', 'Sandra Díaz', 'Pedro Fernández'],
    focus: 'Optimización de la experiencia omnicanal y aplicaciones móviles.'
  },
  {
    name: 'Operaciones Cloud',
    lead: 'Laura Martínez',
    members: ['Laura Martínez', 'Elena García', 'Javier Morales'],
    focus: 'Migración y gobernanza de la infraestructura en la nube.'
  }
];

const TeamsPage = () => (
  <div className="teams-page">
    <header>
      <h2>Equipos de trabajo</h2>
      <p>
        Conoce a los equipos que lideran las iniciativas estratégicas. Una integración con el backend
        permitirá administrar roles y miembros próximamente.
      </p>
    </header>

    <div className="teams-page__grid">
      {TEAMS.map((team) => (
        <article key={team.name} className="teams-card">
          <h3>{team.name}</h3>
          <p className="teams-card__focus">{team.focus}</p>
          <div className="teams-card__lead">
            <span>Team lead</span>
            <strong>{team.lead}</strong>
          </div>
          <div>
            <span>Integrantes</span>
            <ul>
              {team.members.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </div>
);

export default TeamsPage;