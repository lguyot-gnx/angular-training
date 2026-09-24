export type TaskStatusFilter = 'all' | 'active' | 'done';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
  readonly createdAt: number;
}

/** Détail "lourd" d'une tâche, chargé à la demande — voir README point 6 (`resource()`). */
export interface TaskDetail {
  readonly id: string;
  readonly description: string;
  readonly estimateHours: number;
}
