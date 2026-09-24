import { Routes } from '@angular/router';
import { tasksAccessGuard } from '@core/guards/tasks-access.guard';
import { initialTasksResolver } from './data-access/initial-tasks.resolver';
import { TaskStore } from './data-access/task-store.service';
import { TASK_TITLE_VALIDATORS, maxTitleLength, requireNonBlankTitle } from './data-access/task-title-validators.token';

/**
 * `providers: [TaskStore]` scopes the store to this route subtree: created
 * on entering /tasks, destroyed on leaving it (see task-store.service.ts).
 *
 * The two `TASK_TITLE_VALIDATORS` entries are a bonus DI pattern: a
 * multi-provider token, each contributing one rule to the same array
 * (see task-title-validators.token.ts).
 */
export const tasksRoutes: Routes = [
  {
    path: '',
    canActivate: [tasksAccessGuard],
    resolve: { initialTasks: initialTasksResolver },
    providers: [
      TaskStore,
      { provide: TASK_TITLE_VALIDATORS, useValue: requireNonBlankTitle, multi: true },
      { provide: TASK_TITLE_VALIDATORS, useValue: maxTitleLength(80), multi: true },
    ],
    loadComponent: () => import('./containers/task-board/task-board').then((m) => m.TaskBoard),
  },
];
