import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

/** Dumb/presentational component: reports intent via output(), owns no business state. */
@Component({
  selector: 'app-task-create-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-create-form.html',
  styleUrl: './task-create-form.css',
})
export class TaskCreateForm {
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
