import { ChangeDetectionStrategy, Component, input, output, Resource } from '@angular/core';
import { TaskDetail } from '@features/tasks/data-access/task.model';
import { TaskDetailForm } from '@shared/ui/task-detail-form/task-detail-form';

/**
 * Dumb component qui encapsule l'affichage des états d'un `resource()`
 * (loading / error / value) pour le détail d'une tâche — voir README point 6.
 * Reçoit directement la `Resource` (typée en lecture seule) en `input()` :
 * ses signaux internes (`isLoading()`, `error()`, `value()`) restent lus dans
 * ce template et donc suivis normalement par la réactivité, malgré le fait
 * que la référence de l'input elle-même ne change pas.
 */
@Component({
  selector: 'app-task-detail-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskDetailForm],
  templateUrl: './task-detail-panel.html',
})
export class TaskDetailPanel {
  readonly detail = input.required<Resource<TaskDetail | undefined>>();
  readonly saving = input(false);

  readonly saveRequested = output<TaskDetail>();
}
