import { InjectionToken } from '@angular/core';

/**
 * Bonus DI pattern: `window` is a global, not a class — there is no type to
 * `inject()` without a token. Wrapping it behind an InjectionToken (with a
 * default `factory`) also makes it swappable in tests instead of every
 * consumer touching the ambient global directly.
 */
export const WINDOW = new InjectionToken<Window>('WINDOW', {
  providedIn: 'root',
  factory: () => window,
});
