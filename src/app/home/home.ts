import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPreferencesService } from '@core/services/user-preferences.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly preferences = inject(UserPreferencesService);

  onToggleTasksModule(): void {
    this.preferences.toggleTasksModule();
  }
}
