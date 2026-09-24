import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Task, TaskDetail } from './task.model';

const SEED_TASKS: readonly Task[] = [
  { id: 't1', title: 'Découvrir les Signals Angular', done: false, createdAt: Date.now() - 300_000 },
  { id: 't2', title: 'Comprendre la stratégie zoneless', done: false, createdAt: Date.now() - 200_000 },
  { id: 't3', title: 'Relire le pattern smart/dumb', done: true, createdAt: Date.now() - 100_000 },
];

const TASK_DETAILS: Readonly<Record<string, TaskDetail>> = {
  t1: { id: 't1', description: "Lire la doc officielle et coder les exemples du store.", estimateHours: 3 },
  t2: { id: 't2', description: 'Vérifier que rien ne dépend de Zone.js dans le projet.', estimateHours: 2 },
  t3: { id: 't3', description: 'Comparer avec les anciens composants smart/dumb Angular.', estimateHours: 1 },
};

const TASK_COMMENTS: Readonly<Record<string, readonly string[]>> = {
  t1: ['Bien démarrer par `signal()` et `computed()`.', "Voir aussi `linkedSignal()` pour le cas de recherche."],
  t2: ['Attention aux libs tierces qui patchent encore Zone.js.'],
  t3: [],
};

/** Fake HTTP layer: simulates network latency without needing a real backend. */
@Injectable({ providedIn: 'root' })
export class TaskApiService {
  fetchTasks(): Observable<Task[]> {
    return of(SEED_TASKS.map((task) => ({ ...task }))).pipe(delay(300));
  }

  /**
   * Chargement "à la demande" du détail d'une tâche, exposé en `Promise` —
   * consommé par `resource()` dans `task-store.service.ts` (README point 6).
   */
  fetchTaskDetail(id: string): Promise<TaskDetail> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const detail = TASK_DETAILS[id];
        if (detail) {
          resolve({ ...detail });
        } else {
          reject(new Error(`Aucun détail pour la tâche ${id}`));
        }
      }, 400);
    });
  }

  /**
   * Même idée que `fetchTaskDetail()`, mais exposée en `Observable` — sert de
   * démo pour `rxResource()`, qui consomme un flux RxJS plutôt qu'une
   * `Promise` (README point 6).
   */
  fetchTaskComments(id: string): Observable<readonly string[]> {
    return of(TASK_COMMENTS[id] ?? []).pipe(delay(500));
  }
}
