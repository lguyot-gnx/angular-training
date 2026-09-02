import { InjectionToken } from '@angular/core';

export type TaskTitleValidator = (title: string) => string | null;

/**
 * Bonus DI pattern: a *multi*-provider token — several independent
 * providers each contribute one entry to the same array, instead of one
 * service hard-coding every rule. Same idea as Angular's own
 * `NG_VALIDATORS`/`HTTP_INTERCEPTORS`. Registered with `multi: true` in
 * `tasks.routes.ts`, consumed in `task-store.service.ts`.
 */
export const TASK_TITLE_VALIDATORS = new InjectionToken<TaskTitleValidator[]>('TASK_TITLE_VALIDATORS');

export function requireNonBlankTitle(title: string): string | null {
  return title.trim() ? null : 'Le titre ne peut pas être vide.';
}

export function maxTitleLength(max: number): TaskTitleValidator {
  return (title: string) => (title.trim().length > max ? `Le titre dépasse ${max} caractères.` : null);
}
