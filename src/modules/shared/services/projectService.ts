import { Project, ProjectStatus } from '../types/project';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Implementación ERP',
    description: 'Integración del nuevo sistema ERP en toda la organización.',
    status: ProjectStatus.InProgress,
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-07-30',
    manager: 'María López',
    team: ['María López', 'Carlos Pérez', 'Ana Gómez']
  },
  {
    id: '2',
    name: 'Lanzamiento App Móvil',
    description: 'Desarrollo y lanzamiento de la aplicación móvil para clientes.',
    status: ProjectStatus.Planned,
    progress: 10,
    startDate: '2024-03-01',
    endDate: '2024-09-15',
    manager: 'Luis Rodríguez',
    team: ['Luis Rodríguez', 'Sandra Díaz', 'Pedro Fernández']
  },
  {
    id: '3',
    name: 'Migración a la nube',
    description: 'Traslado de la infraestructura actual a servicios en la nube.',
    status: ProjectStatus.Completed,
    progress: 100,
    startDate: '2023-05-10',
    endDate: '2023-12-20',
    manager: 'Laura Martínez',
    team: ['Laura Martínez', 'Diego Torres', 'Elena García']
  }
];

const projectService = {
  async getProjects(): Promise<Project[]> {
    return Promise.resolve(MOCK_PROJECTS);
  },
  async getProjectById(projectId: string): Promise<Project | undefined> {
    return Promise.resolve(MOCK_PROJECTS.find((project) => project.id === projectId));
  }
};

export default projectService;