import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { WINDOW } from '@core/tokens/window.token';

/**
 * DEMO — the exception, not the norm (see README point 2). Simulates a
 * third-party widget ticking via a raw `setInterval`, entirely outside
 * Angular's reactivity/event system. Zoneless Angular has no way to know
 * this plain field changed, so `markForCheck()` is the only way to tell
 * the view it must re-render.
 */
@Component({
  selector: 'app-legacy-tick-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legacy-tick-counter.html',
  styleUrl: './legacy-tick-counter.css',
})
export class LegacyTickCounter implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  // Bonus DI: injected via a token instead of the ambient global — see
  // core/tokens/window.token.ts.
  private readonly windowRef = inject(WINDOW);
  private intervalId: ReturnType<typeof setInterval> | undefined;

  // Deliberately a plain field, not a signal — that is exactly why this
  // component needs markForCheck() below.
  tickCount = 0;
  tickCountSignal = signal(0);

  ngOnInit(): void {
    this.intervalId = this.windowRef.setInterval(() => {
      this.tickCount += 1;
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.windowRef.clearInterval(this.intervalId);
  }
}
