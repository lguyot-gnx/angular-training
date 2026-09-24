import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Task } from './task.model';
import { TaskApiService } from './task-api.service';

/**
 * Pré-charge la liste des tâches avant l'activation de la route `/tasks` :
 * `TaskBoard` reçoit les données via `initialTasks` dès son rendu, sans le
 * flash "liste vide" pendant les 300 ms simulées par `TaskApiService`.
 */
export const initialTasksResolver: ResolveFn<Task[]> = () => inject(TaskApiService).fetchTasks();
