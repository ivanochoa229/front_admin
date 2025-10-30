import { createContext, ReactNode, useContext, useState } from 'react';

import {
  Collaborator,
  CollaboratorRole,
  PriorityLevel,
  Project,
  ProjectStatus,
  Resource,
  ResourceAssignment,
  Task,
  TaskDocument,
  TaskProgressNote,
  TaskStatus
} from '../types/project';

const generateId = (prefix: string) => {
  const randomId =
    typeof globalThis !== 'undefined' && 'crypto' in globalThis && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}-${randomId}`;
};

const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-1',
    firstName: 'María',
    lastName: 'López',
    email: 'maria.lopez@empresa.com',
    phone: '+54 11 5550-1001',
    role: 'Gestor de proyecto'
  },
  {
    id: 'col-2',
    firstName: 'Carlos',
    lastName: 'Pérez',
    email: 'carlos.perez@empresa.com',
    phone: '+54 11 5550-1002',
    role: 'Colaborador'
  },
  {
    id: 'col-3',
    firstName: 'Ana',
    lastName: 'Gómez',
    email: 'ana.gomez@empresa.com',
    phone: '+54 11 5550-1003',
    role: 'Colaborador'
  },
  {
    id: 'col-4',
    firstName: 'Luis',
    lastName: 'Rodríguez',
    email: 'luis.rodriguez@empresa.com',
    phone: '+54 11 5550-1004',
    role: 'Gestor de proyecto'
  },
  {
    id: 'col-5',
    firstName: 'Sandra',
    lastName: 'Díaz',
    email: 'sandra.diaz@empresa.com',
    phone: '+54 11 5550-1005',
    role: 'Colaborador'
  },
  {
    id: 'col-6',
    firstName: 'Pedro',
    lastName: 'Fernández',
    email: 'pedro.fernandez@empresa.com',
    phone: '+54 11 5550-1006',
    role: 'Colaborador'
  },
  {
    id: 'col-7',
    firstName: 'Laura',
    lastName: 'Martínez',
    email: 'laura.martinez@empresa.com',
    phone: '+54 11 5550-1007',
    role: 'Gestor de proyecto'
  },
  {
    id: 'col-8',
    firstName: 'Elena',
    lastName: 'García',
    email: 'elena.garcia@empresa.com',
    phone: '+54 11 5550-1008',
    role: 'Colaborador'
  },
  {
    id: 'col-9',
    firstName: 'Javier',
    lastName: 'Morales',
    email: 'javier.morales@empresa.com',
    phone: '+54 11 5550-1009',
    role: 'Colaborador'
  }
];

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    name: 'Consultor ERP Senior',
    type: 'Servicio profesional',
    cost: 15000,
    description: 'Especialista externo para relevamiento de procesos.'
  },
  {
    id: 'res-2',
    name: 'Licencias ERP',
    type: 'Software',
    cost: 32000,
    description: 'Licencias anuales para el módulo financiero.'
  },
  {
    id: 'res-3',
    name: 'Servidor Cloud',
    type: 'Infraestructura',
    cost: 9000,
    description: 'Instancia cloud dedicada al entorno de pruebas.'
  },
  {
    id: 'res-4',
    name: 'Diseñador UI/UX',
    type: 'Servicio profesional',
    cost: 8000,
    description: 'Diseño de experiencias para la aplicación móvil.'
  }
];

const recalculateProjectMetrics = (project: Project): Project => {
  const usedBudget = project.tasks.reduce(
    (budget, task) =>
      budget + task.resources.reduce((resourceBudget, resource) => resourceBudget + resource.cost, 0),
    0
  );
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task) => task.status === TaskStatus.Completed).length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  let status = project.status;
  if (progress === 100 && totalTasks > 0) {
    status = ProjectStatus.Completed;
  } else if (totalTasks > 0 && progress > 0 && status === ProjectStatus.Planned) {
    status = ProjectStatus.InProgress;
  }

  return {
    ...project,
    usedBudget,
    progress,
    status
  };
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Implementación ERP',
    description: 'Integración del nuevo sistema ERP en toda la organización.',
    status: ProjectStatus.InProgress,
    progress: 0,
    startDate: '2024-01-15',
    endDate: '2024-07-30',
    managerId: 'col-1',
    teamIds: ['col-1', 'col-2', 'col-3'],
    budget: 120000,
    usedBudget: 0,
    priority: PriorityLevel.High,
    tasks: [
      {
        id: 'task-1',
        name: 'Relevamiento de procesos',
        priority: PriorityLevel.Medium,
        startDate: '2024-01-15',
        dueDate: '2024-02-15',
        status: TaskStatus.Completed,
        description: 'Documentación de procesos clave para la configuración del ERP.',
        assigneeIds: ['col-2'],
        documentation: [
          { id: 'doc-1', name: 'relevamiento.pdf', uploadedAt: '2024-02-10T09:00:00.000Z' }
        ],
        resources: [
          {
            id: 'assign-1',
            resourceId: 'res-1',
            name: 'Consultor ERP Senior',
            cost: 15000,
            assignedAt: '2024-01-20T15:00:00.000Z'
          }
        ],
        progressNotes: [
          {
            id: 'note-1',
            message: 'Proceso documentado y aprobado por operaciones.',
            createdAt: '2024-02-12T12:00:00.000Z'
          }
        ],
        createdAt: '2024-01-10T08:00:00.000Z'
      },
      {
        id: 'task-2',
        name: 'Configuración de módulos financieros',
        priority: PriorityLevel.Critical,
        startDate: '2024-02-20',
        dueDate: '2024-05-15',
        status: TaskStatus.InProgress,
        description: 'Parametrización del módulo financiero y de inventario.',
        assigneeIds: ['col-2', 'col-3'],
        documentation: [],
        resources: [
          {
            id: 'assign-2',
            resourceId: 'res-2',
            name: 'Licencias ERP',
            cost: 32000,
            assignedAt: '2024-03-01T13:00:00.000Z'
          }
        ],
        progressNotes: [
          {
            id: 'note-2',
            message: 'Módulos base configurados, resta pruebas integrales.',
            createdAt: '2024-04-10T10:30:00.000Z'
          }
        ],
        createdAt: '2024-02-18T09:30:00.000Z'
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Lanzamiento App Móvil',
    description: 'Desarrollo y lanzamiento de la aplicación móvil para clientes.',
    status: ProjectStatus.Planned,
    progress: 0,
    startDate: '2024-03-01',
    endDate: '2024-09-15',
    managerId: 'col-4',
    teamIds: ['col-4', 'col-5', 'col-6'],
    budget: 80000,
    usedBudget: 0,
    priority: PriorityLevel.Medium,
    tasks: [
      {
        id: 'task-3',
        name: 'Definición de roadmap',
        priority: PriorityLevel.High,
        startDate: '2024-03-01',
        dueDate: '2024-03-31',
        status: TaskStatus.Pending,
        description: 'Recolección de requerimientos y priorización del MVP.',
        assigneeIds: ['col-5'],
        documentation: [],
        resources: [],
        progressNotes: [],
        createdAt: '2024-02-25T11:00:00.000Z'
      }
    ]
  },
  {
    id: 'proj-3',
    name: 'Migración a la nube',
    description: 'Traslado de la infraestructura actual a servicios en la nube.',
    status: ProjectStatus.Completed,
    progress: 0,
    startDate: '2023-05-10',
    endDate: '2023-12-20',
    managerId: 'col-7',
    teamIds: ['col-7', 'col-8', 'col-9'],
    budget: 95000,
    usedBudget: 0,
    priority: PriorityLevel.Medium,
    tasks: [
      {
        id: 'task-4',
        name: 'Migración de bases de datos',
        priority: PriorityLevel.High,
        startDate: '2023-07-01',
        dueDate: '2023-08-20',
        status: TaskStatus.Completed,
        description: 'Migración de bases de datos principales a infraestructura cloud.',
        assigneeIds: ['col-8'],
        documentation: [
          { id: 'doc-2', name: 'plan-migracion.xlsx', uploadedAt: '2023-07-05T08:30:00.000Z' }
        ],
        resources: [
          {
            id: 'assign-3',
            resourceId: 'res-3',
            name: 'Servidor Cloud',
            cost: 9000,
            assignedAt: '2023-07-02T10:45:00.000Z'
          }
        ],
        progressNotes: [
          {
            id: 'note-3',
            message: 'Bases migradas sin incidentes, monitoreo 48h completado.',
            createdAt: '2023-08-22T09:15:00.000Z'
          }
        ],
        createdAt: '2023-06-12T10:00:00.000Z'
      }
    ]
  }
].map(recalculateProjectMetrics);

export interface CreateProjectPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  priority: PriorityLevel;
  managerId: string;
}

export interface CreateTaskPayload {
  name: string;
  priority: PriorityLevel;
  startDate: string;
  dueDate: string;
  description?: string;
}

export interface RegisterCollaboratorPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: CollaboratorRole;
}

interface ProjectManagementContextValue {
  projects: Project[];
  collaborators: Collaborator[];
  resources: Resource[];
  createProject: (payload: CreateProjectPayload) => Project;
  createTask: (projectId: string, payload: CreateTaskPayload) => Task;
  deleteTask: (projectId: string, taskId: string) => void;
  setTaskCollaborators: (projectId: string, taskId: string, collaboratorIds: string[]) => void;
  assignResourceToTask: (projectId: string, taskId: string, resourceId: string) => ResourceAssignment;
  removeResourceFromTask: (projectId: string, taskId: string, assignmentId: string) => void;
  addDocumentationToTask: (projectId: string, taskId: string, documentNames: string[]) => TaskDocument[];
  removeDocumentationFromTask: (projectId: string, taskId: string, documentId: string) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: TaskStatus, note: string) => void;
  registerCollaborator: (payload: RegisterCollaboratorPayload) => Collaborator;
}

const ProjectManagementContext = createContext<ProjectManagementContextValue | undefined>(undefined);

export const ProjectManagementProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [resources] = useState<Resource[]>(INITIAL_RESOURCES);

  const createProject = (payload: CreateProjectPayload) => {
    const { name, description, startDate, endDate, budget, priority, managerId } = payload;
    if (!name.trim() || !description.trim()) {
      throw new Error('El nombre y la descripción del proyecto son obligatorios.');
    }

    if (!startDate || !endDate) {
      throw new Error('Las fechas de inicio y fin son obligatorias.');
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha estimada de finalización.');
    }

    if (!Number.isFinite(budget) || budget <= 0) {
      throw new Error('El presupuesto debe ser un número mayor a cero.');
    }

    if (!managerId) {
      throw new Error('Se debe seleccionar un gestor responsable.');
    }

    const project: Project = recalculateProjectMetrics({
      id: generateId('proj'),
      name: name.trim(),
      description: description.trim(),
      status: ProjectStatus.Planned,
      progress: 0,
      startDate,
      endDate,
      managerId,
      teamIds: [managerId],
      budget,
      usedBudget: 0,
      priority,
      tasks: []
    });

    setProjects((prev) => [...prev, project]);

    return project;
  };

  const createTask = (projectId: string, payload: CreateTaskPayload) => {
    const { name, priority, startDate, dueDate, description } = payload;

    if (!name.trim()) {
      throw new Error('El nombre de la tarea es obligatorio.');
    }

    if (!startDate || !dueDate) {
      throw new Error('Las fechas de la tarea son obligatorias.');
    }

    if (new Date(startDate) > new Date(dueDate)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha estimada de finalización de la tarea.');
    }

    const task: Task = {
      id: generateId('task'),
      name: name.trim(),
      priority,
      startDate,
      dueDate,
      status: TaskStatus.Pending,
      description: description?.trim() ?? '',
      assigneeIds: [],
      documentation: [],
      resources: [],
      progressNotes: [],
      createdAt: new Date().toISOString()
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedProject = {
          ...project,
          tasks: [...project.tasks, task]
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );

    return task;
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedProject = {
          ...project,
          tasks: project.tasks.filter((task) => task.id !== taskId)
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );
  };

  const setTaskCollaborators = (projectId: string, taskId: string, collaboratorIds: string[]) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const uniqueCollaborators = [...new Set(collaboratorIds)];
        const updatedProject = {
          ...project,
          teamIds: [...new Set([...project.teamIds, ...uniqueCollaborators])],
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assigneeIds: uniqueCollaborators
                }
              : task
          )
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );
  };

  const assignResourceToTask = (projectId: string, taskId: string, resourceId: string) => {
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource) {
      throw new Error('El recurso seleccionado no está disponible.');
    }

    const assignment: ResourceAssignment = {
      id: generateId('assign'),
      resourceId: resource.id,
      name: resource.name,
      cost: resource.cost,
      assignedAt: new Date().toISOString()
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedProject = {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  resources: [...task.resources, assignment]
                }
              : task
          )
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );

    return assignment;
  };

  const removeResourceFromTask = (projectId: string, taskId: string, assignmentId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedProject = {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  resources: task.resources.filter((resource) => resource.id !== assignmentId)
                }
              : task
          )
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );
  };

  const addDocumentationToTask = (projectId: string, taskId: string, documentNames: string[]) => {
    const documents: TaskDocument[] = documentNames.map((name) => ({
      id: generateId('doc'),
      name,
      uploadedAt: new Date().toISOString()
    }));

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  documentation: [...task.documentation, ...documents]
                }
              : task
          )
        };
      })
    );

    return documents;
  };

  const removeDocumentationFromTask = (projectId: string, taskId: string, documentId: string) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        return {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  documentation: task.documentation.filter((document) => document.id !== documentId)
                }
              : task
          )
        };
      })
    );
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: TaskStatus, note: string) => {
    if (!note.trim()) {
      throw new Error('Se debe ingresar una descripción del avance.');
    }

    const progressNote: TaskProgressNote = {
      id: generateId('note'),
      message: note.trim(),
      createdAt: new Date().toISOString()
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedProject = {
          ...project,
          tasks: project.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  progressNotes: [...task.progressNotes, progressNote]
                }
              : task
          )
        };

        return recalculateProjectMetrics(updatedProject);
      })
    );
  };

  const registerCollaborator = (payload: RegisterCollaboratorPayload) => {
    const { firstName, lastName, email, phone, role } = payload;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      throw new Error('Todos los campos del usuario son obligatorios.');
    }

    const collaborator: Collaborator = {
      id: generateId('col'),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role
    };

    setCollaborators((prev) => [...prev, collaborator]);

    return collaborator;
  };

  return (
    <ProjectManagementContext.Provider
      value={{
        projects,
        collaborators,
        resources,
        createProject,
        createTask,
        deleteTask,
        setTaskCollaborators,
        assignResourceToTask,
        removeResourceFromTask,
        addDocumentationToTask,
        removeDocumentationFromTask,
        updateTaskStatus,
        registerCollaborator
      }}
    >
      {children}
    </ProjectManagementContext.Provider>
  );
};

export const useProjectManagement = () => {
  const context = useContext(ProjectManagementContext);

  if (!context) {
    throw new Error('useProjectManagement debe utilizarse dentro de un ProjectManagementProvider');
  }

  return context;
};