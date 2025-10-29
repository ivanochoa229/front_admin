export enum ProjectStatus {
  Planned = 'Planificado',
  InProgress = 'En progreso',
  Completed = 'Completado',
  OnHold = 'En pausa'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  manager: string;
  team: string[];
}