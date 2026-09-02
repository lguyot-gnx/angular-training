import { Routes } from '@angular/router';
import { tasksAccessGuard } from '@core/guards/tasks-access.guard';
import { TaskStore } from './data-access/task-store.service';

/**
 * `providers: [TaskStore]` scopes the store to this route subtree: created
 * on entering /tasks, destroyed on leaving it (see task-store.service.ts).
 */
export const tasksRoutes: Routes = [
  {
    path: '',
    canActivate: [tasksAccessGuard],
    providers: [TaskStore],
    loadComponent: () => import('./containers/task-board/task-board').then((m) => m.TaskBoard),
  },
];
