import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/** Dumb/presentational component: reports intent via output(), owns no business state. */
@Component({
  selector: 'app-task-create-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-create-form.html',
  styleUrl: './task-create-form.css',
})
export class TaskCreateForm {
  // Error message comes from TaskStore's TASK_TITLE_VALIDATORS (bonus DI
  // pattern) via the smart component — this dumb component never injects
  // the store itself.
  readonly titleError = input<string | null>(null);

  readonly createRequested = output<string>();

  readonly title = signal('');

  onSubmit(event: Event): void {
    event.preventDefault();
    const value = this.title().trim();
    if (!value) {
      return;
    }
    this.createRequested.emit(value);
    this.title.set('');
  }

  onTitleInput(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }
}
