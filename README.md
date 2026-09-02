# Angular Training — Signals, détection, DI moderne & smart/dumb

Projet support pour une formation interne Angular destinée à des développeurs déjà à l'aise
avec Angular. Application "gestion de tâches" minimale (liste, filtres, création, édition),
générée avec Angular CLI 21, 100% standalone, **zoneless**, avec le control flow natif
(`@if` / `@for` / `@switch`) partout — pas de `NgModule`, pas de `*ngIf`/`*ngFor`.

Aucun backend réel : `TaskApiService` simule un appel HTTP avec un délai (`delay(300)` via RxJS).

## Démarrer

Le projet utilise **Yarn** (v4, linker `node-modules` — voir `.yarnrc.yml`) comme gestionnaire
de paquets. Installer les dépendances avec `yarn install` (ou juste `yarn`).

```bash
yarn start   # ng serve
yarn test    # ng test (Vitest)
yarn build
```

## Structure

```
src/app/
├── core/                # services & guards globaux (providedIn: 'root')
├── shared/
│   ├── ui/               # composants "dumb" réutilisables
│   └── data-access/      # services génériques (storage, flux externe simulé)
├── features/tasks/       # la feature "tâches"
│   ├── data-access/       # TaskStore (signals) + modèle + API mockée
│   └── containers/         # composant "smart"
└── home/                 # page d'accueil (hors périmètre feature)
```

## Plan de démo — fichier par fichier

### 1. Signals et opérateurs

📄 **`src/app/features/tasks/data-access/task-store.service.ts`**
Tous les opérateurs sont présents et commentés dans ce seul fichier :
- `signal()` — `tasks`, `statusFilter` : l'état source.
- `computed()` — `activeCount`, `filteredTasks` : état dérivé pur.
- `equal` personnalisé — sur `filteredTasks` (voir `task.utils.ts` → `sameTasks`), pour éviter
  de notifier les consommateurs quand le contenu du tableau filtré est identique.
- `linkedSignal()` — `searchText` : se réinitialise quand `statusFilter` change, mais reste
  librement modifiable ensuite.
- `effect()` — persistance dans le storage : effet de bord isolé, pas un `computed()`.
- `effect()` + `untracked()` — auto-sélection de `selectedTaskId` : montre le piège de boucle
  infinie qu'`untracked()` évite.
- `toSignal()` — `activityLog`, qui convertit le flux RxJS de `ActivityFeedService`
  (`src/app/shared/data-access/activity-feed.service.ts`, un flux "tiers" jamais migré aux
  signals).

### 2. Stratégie de détection des composants

📄 **`src/app/features/tasks/_exemples-a-ne-pas-suivre/buggy-task-list.example.ts`**
Composant volontairement bugué, non branché dans l'application. `addBuggy()` mute le tableau
derrière le signal (`.push()`) → la vue ne se met jamais à jour ; `addFixed()` montre le
correctif avec `.update()`. À coller en live dans une page temporaire pour la démo.

📄 **`src/app/shared/ui/legacy-tick-counter/legacy-tick-counter.ts`**
L'exception qui justifie `ChangeDetectorRef.markForCheck()` : un `setInterval` "tiers" hors du
radar d'Angular, qui mute un champ non-signal — sans `markForCheck()`, le compteur resterait
figé à l'écran en zoneless. Visible dans le tableau de bord (`task-board.html`).

Tous les autres composants n'utilisent que des signals dans leur template et
`ChangeDetectionStrategy.OnPush` — aucun autre appel à `markForCheck()` n'est nécessaire.

### 3. Injection de dépendances moderne

📄 **`src/app/core/services/user-preferences.service.ts`**
Service global `providedIn: 'root'` — un singleton pour toute l'application (thème, préférences).

📄 **`src/app/features/tasks/data-access/task-store.service.ts`** (déclaration `@Injectable()`,
sans `providedIn`) + **`src/app/features/tasks/tasks.routes.ts`** (`providers: [TaskStore]`)
Service scopé à la route de la feature : créé à l'entrée sur `/tasks`, détruit en sortant —
l'état ne doit pas survivre à la navigation hors de la feature.

📄 **`src/app/core/guards/tasks-access.guard.ts`**
Guard fonctionnel (`CanActivateFn`) utilisant `inject()` : un cas où l'injection par
constructeur est impossible puisqu'il n'y a pas de classe/constructeur. Démo live possible
depuis la page d'accueil (`src/app/home/home.html`) : décocher "Module tâches activé" puis
cliquer sur "Aller aux tâches" pour voir la redirection.

Tous les composants/services utilisent `inject()` en fonction — aucune injection par
constructeur dans le projet.

### 4. Pattern smart/dumb

📄 **`src/app/features/tasks/containers/task-board/task-board.ts`** (+ `.html`)
Composant **smart** : injecte `TaskStore`, orchestre tous les composants dumb ci-dessous, ne
contient aucune logique de présentation complexe.

📄 **`src/app/shared/ui/task-filter-bar/task-filter-bar.ts`**
Composant **dumb** : uniquement `input()` / `output()`.

📄 **`src/app/shared/ui/task-item/task-item.ts`**
Composant **dumb** : `input.required()` pour la tâche, `model()` pour la case "terminé"
(binding bidirectionnel simple), `output()` pour renommer/supprimer, et un **état UI local**
(`isEditing`, `draftTitle`) géré par `signal()` — un dumb component peut porter de l'état
purement présentationnel tant que ce n'est pas de la donnée métier partagée (voir le
commentaire dans le fichier).

📄 **`src/app/shared/ui/task-create-form/task-create-form.ts`**
Composant **dumb** supplémentaire : `output()` seul, pour la création de tâche.
