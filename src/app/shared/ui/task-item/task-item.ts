import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { Task } from '@features/tasks/data-access/task.model';

/**
 * Dumb/presentational component: only input()/model()/output(), no
 * injected data service, no knowledge of TaskStore — see README point 4.
 */
@Component({
  selector: 'li[app-task-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'task-item',
    '[class.task-item--done]': 'done()',
  },
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  readonly task = input.required<Task>();

  // model(): simple two-way primitive. The parent (TaskBoard) listens to the
  // implicit `doneChange` output rather than using the `[(done)]` sugar, so
  // the change still goes through the store's immutable `update()` instead
  // of writing straight into the task object (no direct mutation, point 2).
  readonly done = model(false);

  readonly renameRequested = output<string>();
  readonly deleteRequested = output<string>();

  // Local UI-only state: "editing" belongs to this component, never to the
  // task store — it isn't shared business data, so a plain signal() is
  // enough and it resets automatically when the component is destroyed.
  readonly isEditing = signal(false);
  readonly draftTitle = signal('');

  startEdit(): void {
    this.draftTitle.set(this.task().title);
    this.isEditing.set(true);
  }

  confirmEdit(): void {
    this.renameRequested.emit(this.draftTitle());
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onDraftTitleInput(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
  }

  onDoneChange(event: Event): void {
    this.done.set((event.target as HTMLInputElement).checked);
  }
}
