import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LegacyTickCounter } from '@shared/ui/legacy-tick-counter/legacy-tick-counter';
import { TaskCreateForm } from '@shared/ui/task-create-form/task-create-form';
import { TaskFilterBar } from '@shared/ui/task-filter-bar/task-filter-bar';
import { TaskItem } from '@shared/ui/task-item/task-item';
import { TaskStatusFilter } from '../../data-access/task.model';
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
  imports: [TaskItem, TaskFilterBar, TaskCreateForm, LegacyTickCounter],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  protected readonly store = inject(TaskStore);

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

  onCreate(title: string): void {
    this.store.addTask(title);
  }
}
