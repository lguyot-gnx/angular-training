import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Task } from './task.model';

const SEED_TASKS: readonly Task[] = [
  { id: 't1', title: 'Découvrir les Signals Angular', done: false, createdAt: Date.now() - 300_000 },
  { id: 't2', title: 'Comprendre la stratégie zoneless', done: false, createdAt: Date.now() - 200_000 },
  { id: 't3', title: 'Relire le pattern smart/dumb', done: true, createdAt: Date.now() - 100_000 },
];

/** Fake HTTP layer: simulates network latency without needing a real backend. */
@Injectable({ providedIn: 'root' })
export class TaskApiService {
  fetchTasks(): Observable<Task[]> {
    return of(SEED_TASKS.map((task) => ({ ...task }))).pipe(delay(300));
  }
}
