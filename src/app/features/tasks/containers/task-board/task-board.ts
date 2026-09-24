import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { HighlightDirective } from '@shared/directives/highlight.directive';
import { LegacyTickCounter } from '@shared/ui/legacy-tick-counter/legacy-tick-counter';
import { TaskCreateForm } from '@shared/ui/task-create-form/task-create-form';
import { TaskDetailPanel } from '@shared/ui/task-detail-panel/task-detail-panel';
import { TaskFilterBar } from '@shared/ui/task-filter-bar/task-filter-bar';
import { TaskItem } from '@shared/ui/task-item/task-item';
import { Task, TaskDetail, TaskStatusFilter } from '../../data-access/task.model';
import { TaskStore } from '../../data-access/task-store.service';

/**
 * Smart component (container): owns the feature service (TaskStore) and
 * all the business logic. Every child below is a dumb/presentational
 * component that only receives data via input()/model() and reports back
 * via output() — see README point 4.
 */
@Component({
  selector: 'app-task-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskItem, TaskFilterBar, TaskCreateForm, TaskDetailPanel, LegacyTickCounter, HighlightDirective],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  protected readonly store = inject(TaskStore);

  // Alimenté par `initialTasksResolver` via `withComponentInputBinding()`
  // (voir app.config.ts et tasks.routes.ts) — README, Bonus "Data Resolvers".
  readonly initialTasks = input.required<Task[]>();

  constructor() {
    effect(() => this.store.seedTasks(this.initialTasks()));
  }

  onStatusChange(filter: TaskStatusFilter): void {
    this.store.setStatusFilter(filter);
  }

  onSearchChange(text: string): void {
    this.store.setSearchText(text);
  }

  onDoneChange(id: string, done: boolean): void {
    this.store.toggleDone(id, done);
  }

  onRename(id: string, title: string): void {
    this.store.renameTask(id, title);
  }

  onDelete(id: string): void {
    this.store.removeTask(id);
  }

  onSelect(id: string): void {
    this.store.selectTask(id);
  }

  onCreate(title: string): void {
    this.store.addTask(title);
  }

  onSaveDetail(detail: TaskDetail): void {
    this.store.updateTaskDetail(detail);
  }
}
