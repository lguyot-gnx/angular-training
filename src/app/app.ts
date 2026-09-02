import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserPreferencesService } from '@core/services/user-preferences.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly preferences = inject(UserPreferencesService);

  constructor() {
    // Theme lives on <html data-theme> rather than a component class so
    // every encapsulated component stylesheet — and native controls via
    // `color-scheme` — reads the same tokens from styles.css.
    effect(() => {
      document.documentElement.dataset['theme'] = this.preferences.theme();
    });
  }

  onToggleTheme(): void {
    this.preferences.toggleTheme();
  }
}
