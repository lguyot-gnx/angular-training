import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserPreferencesService } from '@core/services/user-preferences.service';

/**
 * Functional guard: a `CanActivateFn` is a plain function, not a class, so
 * there is no constructor to inject through — `inject()` is the only way
 * to reach a service here. This is the case constructor DI cannot cover.
 */
export const tasksAccessGuard: CanActivateFn = () => {
  const preferences = inject(UserPreferencesService);
  const router = inject(Router);

  return preferences.tasksModuleEnabled() ? true : router.createUrlTree(['/']);
};
