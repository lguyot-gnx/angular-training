import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskDetail } from '@features/tasks/data-access/task.model';

/**
 * Dumb/presentational component — démo **Reactive Forms**, en complément du
 * formulaire "manuel" (un seul `signal()`, voir `TaskCreateForm`) : un
 * `FormGroup` typé avec des `FormControl`, des `Validators` déclaratifs, et
 * un état de validation (`.invalid`, `.touched`, `.errors`) exposé
 * directement par le form plutôt que recalculé à la main.
 *
 * Reste un dumb component au sens du README point 4 : aucune injection de
 * service, tout arrive par `input()` et repart par `output()`.
 */
@Component({
  selector: 'app-task-detail-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './task-detail-form.html',
  styleUrl: './task-detail-form.css',
})
export class TaskDetailForm {
  readonly detail = input.required<TaskDetail>();
  readonly saving = input(false);

  readonly saveRequested = output<TaskDetail>();

  readonly form = new FormGroup({
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    estimateHours: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(40)],
    }),
  });

  constructor() {
    // `detail` change à chaque sélection de tâche (`selectedTaskId` dans
    // TaskStore) : on resynchronise le form sur la nouvelle valeur reçue.
    // `emitEvent: false` évite de redéclencher un `valueChanges` pour ce
    // reset — seule la saisie de l'utilisateur doit en produire un.
    effect(() => {
      const detail = this.detail();
      this.form.reset({ description: detail.description, estimateHours: detail.estimateHours }, { emitEvent: false });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saveRequested.emit({ id: this.detail().id, ...this.form.getRawValue() });
  }
}
