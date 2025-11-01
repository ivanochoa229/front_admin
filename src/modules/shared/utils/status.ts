import { PriorityLevel, TaskStatus } from '../types/project';

const PRIORITY_DESCRIPTION_TO_LEVEL: Record<string, PriorityLevel> = {
  ALTA: PriorityLevel.High,
  MEDIA: PriorityLevel.Medium,
  BAJA: PriorityLevel.Low
};

const TASK_STATUS_DESCRIPTION_TO_STATUS: Record<string, TaskStatus> = {
  CREADA: TaskStatus.Pending,
  PENDIENTE: TaskStatus.Pending,
  'EN CURSO': TaskStatus.InProgress,
  'EN REVISION': TaskStatus.InReview,
  'EN REVISIÓN': TaskStatus.InReview,
  COMPLETADA: TaskStatus.Completed
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Pending]: 'Pendiente',
  [TaskStatus.InProgress]: 'En curso',
  [TaskStatus.InReview]: 'En revisión',
  [TaskStatus.Completed]: 'Completada'
};

export const mapPriorityDescription = (description: string): PriorityLevel => {
  const normalized = description?.trim().toUpperCase();
  return PRIORITY_DESCRIPTION_TO_LEVEL[normalized] ?? PriorityLevel.Medium;
};

export const mapTaskStatusDescription = (description: string): TaskStatus => {
  const normalized = description?.trim().toUpperCase();
  return TASK_STATUS_DESCRIPTION_TO_STATUS[normalized] ?? TaskStatus.Pending;
};

export const getTaskStatusLabel = (status: TaskStatus): string => TASK_STATUS_LABELS[status];