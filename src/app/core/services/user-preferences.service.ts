import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Global, app-wide state (theme, page size, feature toggles): must survive
 * every navigation, so it is `providedIn: 'root'` — a single instance for
 * the whole app lifetime. Compare with TaskStore (feature-scoped).
 */
@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  readonly theme = signal<Theme>('light');
  readonly pageSize = signal(10);

  // Live demo hook for the functional guard: toggle to false on the home
  // page, then try to navigate to /tasks.
  readonly tasksModuleEnabled = signal(true);

  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  toggleTasksModule(): void {
    this.tasksModuleEnabled.update((current) => !current);
  }
}
