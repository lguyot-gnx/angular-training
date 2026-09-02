export type TaskStatusFilter = 'all' | 'active' | 'done';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
  readonly createdAt: number;
}
