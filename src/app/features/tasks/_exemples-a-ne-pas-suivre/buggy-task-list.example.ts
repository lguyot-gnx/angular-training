import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * NE PAS SUIVRE — exemple pédagogique volontairement bugué (voir README,
 * point 2). Ce fichier n'est importé ni déclaré nulle part dans
 * l'application : c'est un support de démo, pas du code applicatif.
 *
 * Pour la démo live : coller ce composant dans les `imports` d'une page
 * temporaire, montrer que "Ajouter (bugué)" ne rafraîchit jamais la liste
 * à l'écran (alors que `items()` contient bien le nouvel élément — vérifier
 * au débogueur), puis corriger `addBuggy()` en s'inspirant d'`addFixed()`.
 */
@Component({
  selector: 'app-buggy-task-list-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (item of items(); track item) {
        <li>{{ item }}</li>
      }
    </ul>
    <button type="button" (click)="addBuggy()">Ajouter (bugué)</button>
    <button type="button" (click)="addFixed()">Ajouter (correct)</button>
  `,
})
export class BuggyTaskListExample {
  readonly items = signal<string[]>(['Première tâche']);

  addBuggy(): void {
    // BUG : mutation directe du tableau derrière le signal. `items` garde
    // la même référence de tableau, donc Angular ne détecte aucun
    // changement : la vue ne se met jamais à jour, même si l'élément a bien
    // été ajouté en mémoire.
    this.items().push(`Tâche ${this.items().length + 1}`);
  }

  addFixed(): void {
    // CORRECT : `.update()` crée une nouvelle référence de tableau, ce qui
    // notifie tous les consommateurs du signal (template, computed, effect).
    this.items.update((list) => [...list, `Tâche ${list.length + 1}`]);
  }
}
