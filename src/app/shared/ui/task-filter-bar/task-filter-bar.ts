import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskStatusFilter } from '@features/tasks/data-access/task.model';

const STATUS_LABELS: Record<TaskStatusFilter, string> = {
  all: 'Toutes',
  active: 'Actives',
  done: 'Terminées',
};

/** Dumb/presentational component: input()/output() only, no injected service. */
@Component({
  selector: 'app-task-filter-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-filter-bar.html',
  styleUrl: './task-filter-bar.css',
})
export class TaskFilterBar {
  readonly status = input<TaskStatusFilter>('all');
  readonly search = input('');

  readonly statusChange = output<TaskStatusFilter>();
  readonly searchChange = output<string>();

  readonly statusOptions: readonly TaskStatusFilter[] = ['all', 'active', 'done'];

  labelFor(option: TaskStatusFilter): string {
    return STATUS_LABELS[option];
  }

  onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
