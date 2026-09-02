import { Injectable, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivityFeedService } from '@shared/data-access/activity-feed.service';
import { StorageService } from '@shared/data-access/storage.service';
import { Task, TaskStatusFilter } from './task.model';
import { TaskApiService } from './task-api.service';
import { TASK_TITLE_VALIDATORS } from './task-title-validators.token';
import { sameTasks } from './task.utils';

const STORAGE_KEY = 'training.tasks.snapshot';

/**
 * Feature-scoped store — provided in `tasks.routes.ts` `providers`, NOT
 * `providedIn: 'root'`. This state is created when entering /tasks and
 * destroyed when leaving it: it must not survive navigation outside the
 * feature. Compare with UserPreferencesService (root, app-wide).
 */
@Injectable()
export class TaskStore {
  private readonly api = inject(TaskApiService);
  private readonly storage = inject(StorageService);
  private readonly activityFeed = inject(ActivityFeedService);
  // Bonus DI: multi-provider token — `optional` because nothing guarantees
  // it was registered (e.g. a test bed that doesn't provide it).
  private readonly titleValidators = inject(TASK_TITLE_VALIDATORS, { optional: true }) ?? [];

  // --- signal(): source of truth ----------------------------------------
  readonly tasks = signal<Task[]>([]);
  readonly statusFilter = signal<TaskStatusFilter>('all');

  // --- linkedSignal(): derived default that stays manually editable -----
  // Resets to '' whenever the status tab changes (its `source`), but once
  // reset the user can freely type in it — unlike computed(), a
  // linkedSignal can be written to with .set()/.update() afterwards.
  readonly searchText = linkedSignal({
    source: this.statusFilter,
    computation: () => '',
  });

  // --- computed(): pure derived state, no side effects -------------------
  readonly activeCount = computed(() => this.tasks().filter((task) => !task.done).length);

  // Custom `equal`: filtering builds a brand-new array every time this runs,
  // but its *content* is often unchanged (e.g. recomputed after an
  // unrelated signal write). A content-based equal avoids waking up
  // effects/templates that depend on this computed for no real change.
  readonly filteredTasks = computed(
    () => {
      const filter = this.statusFilter();
      const query = this.searchText().trim().toLowerCase();
      return this.tasks().filter((task) => {
        if (filter === 'active' && task.done) {
          return false;
        }
        if (filter === 'done' && !task.done) {
          return false;
        }
        return query === '' || task.title.toLowerCase().includes(query);
      });
    },
    { equal: sameTasks },
  );

  // --- toSignal(): bridge an existing RxJS flow (third-party lib) --------
  readonly activityLog = toSignal(this.activityFeed.messages$, { initialValue: [] as readonly string[] });

  readonly selectedTaskId = signal<string | null>(null);

  // Surfaces the first `TASK_TITLE_VALIDATORS` failure to the smart component.
  readonly titleError = signal<string | null>(null);

  constructor() {
    this.api.fetchTasks().subscribe((tasks) => this.tasks.set(tasks));

    // --- effect(): isolated side effect, not a computed() ----------------
    // Persisting to storage produces no value that other state depends on
    // — it's I/O, not derived data. A computed() must stay pure, so this
    // has to be an effect().
    effect(() => {
      this.storage.setItem(STORAGE_KEY, this.tasks());
    });

    // --- effect() + untracked(): read a signal without depending on it ---
    // This effect reacts to `tasks` changing and keeps `selectedTaskId`
    // valid. It also *writes* selectedTaskId. Reading it the normal way
    // would register it as a dependency too, so every `.set()` below would
    // re-schedule this same effect — an infinite loop. `untracked()` reads
    // its current value without creating that dependency.
    effect(() => {
      const list = this.tasks();
      const currentSelection = untracked(() => this.selectedTaskId());
      const stillExists = list.some((task) => task.id === currentSelection);
      if (!stillExists) {
        this.selectedTaskId.set(list[0]?.id ?? null);
      }
    });
  }

  addTask(title: string): void {
    const trimmed = title.trim();
    const error = this.firstValidationError(trimmed);
    if (error) {
      this.titleError.set(error);
      return;
    }
    this.titleError.set(null);
    this.tasks.update((list) => [
      ...list,
      { id: crypto.randomUUID(), title: trimmed, done: false, createdAt: Date.now() },
    ]);
  }

  renameTask(id: string, title: string): void {
    const trimmed = title.trim();
    if (this.firstValidationError(trimmed)) {
      return;
    }
    this.tasks.update((list) => list.map((task) => (task.id === id ? { ...task, title: trimmed } : task)));
  }

  private firstValidationError(title: string): string | null {
    for (const validate of this.titleValidators) {
      const error = validate(title);
      if (error) {
        return error;
      }
    }
    return null;
  }

  toggleDone(id: string, done: boolean): void {
    this.tasks.update((list) => list.map((task) => (task.id === id ? { ...task, done } : task)));
  }

  removeTask(id: string): void {
    this.tasks.update((list) => list.filter((task) => task.id !== id));
  }

  setStatusFilter(filter: TaskStatusFilter): void {
    this.statusFilter.set(filter);
  }

  setSearchText(text: string): void {
    this.searchText.set(text);
  }

  selectTask(id: string | null): void {
    this.selectedTaskId.set(id);
  }
}
