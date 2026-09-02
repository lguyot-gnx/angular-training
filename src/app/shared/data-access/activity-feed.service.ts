import { Injectable } from '@angular/core';
import { Observable, interval, map, scan } from 'rxjs';

/**
 * Stands in for a third-party lib that only exposes an RxJS stream (e.g. a
 * websocket client) and was never migrated to Signals. A feature service
 * bridges it into the signal graph with `toSignal()` — see TaskStore.
 */
@Injectable({ providedIn: 'root' })
export class ActivityFeedService {
  readonly messages$: Observable<readonly string[]> = interval(4000).pipe(
    map((tick) => `Activité externe reçue #${tick + 1}`),
    scan((log, message) => [...log, message].slice(-5), [] as string[]),
  );
}
