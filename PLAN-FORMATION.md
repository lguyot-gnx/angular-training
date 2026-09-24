# Plan de formation — index des points → fichiers

Un lien direct entre chaque point du plan de formation et l'endroit exact du projet où il
est traité. Les liens sont relatifs à la racine du dépôt (cliquables dans VS Code / GitHub).

## Setup initial

| Sujet | Fichier(s) |
|---|---|
| Génération du projet (`ng new`, standalone, zoneless) | [`angular.json`](angular.json), [`package.json`](package.json) |
| Alias TypeScript (`@core`, `@shared`, `@features`) | [`tsconfig.json`](tsconfig.json) |
| Control flow natif (`@if` / `@for` / `@switch`) | visible dans tous les templates, ex. [`task-board.html`](src/app/features/tasks/containers/task-board/task-board.html) |
| Structure par feature | dossiers [`core/`](src/app/core), [`shared/`](src/app/shared), [`features/`](src/app/features) |
| App support "gestion de tâches" (mock, délai simulé) | [`task-api.service.ts`](src/app/features/tasks/data-access/task-api.service.ts) |

## Point 1 — Signals et opérateurs

Tout est centralisé dans le service de données de la feature :

| Opérateur | Fichier | Repère |
|---|---|---|
| `signal()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `tasks`, `statusFilter` |
| `computed()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `activeCount`, `filteredTasks` |
| `equal` personnalisé | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) + [`task.utils.ts`](src/app/features/tasks/data-access/task.utils.ts) | `filteredTasks`, `sameTasks()` |
| `linkedSignal()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `searchText` |
| `effect()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | persistance dans le `constructor()` |
| `effect()` + `untracked()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | auto-sélection de `selectedTaskId` |
| `toSignal()` | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `activityLog`, source : [`activity-feed.service.ts`](src/app/shared/data-access/activity-feed.service.ts) |
| `resource()` (loader `Promise`) | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `taskDetail`, source : [`task-api.service.ts`](src/app/features/tasks/data-access/task-api.service.ts) `fetchTaskDetail()` |
| `rxResource()` (loader `Observable`) | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) | `taskComments`, source : [`task-api.service.ts`](src/app/features/tasks/data-access/task-api.service.ts) `fetchTaskComments()` |
| États `.isLoading()` / `.error()` / `.value()` en démo live | [`task-board.html`](src/app/features/tasks/containers/task-board/task-board.html) | panneau "Détail", déclenché par le bouton "Détail" de [`task-item.html`](src/app/shared/ui/task-item/task-item.html) |

## Point 2 — Stratégie de détection des composants

| Sujet | Fichier |
|---|---|
| `OnPush` partout | tous les `@Component` du projet |
| Bug volontaire (mutation directe) | [`buggy-task-list.example.ts`](src/app/features/tasks/_exemples-a-ne-pas-suivre/buggy-task-list.example.ts) |
| Cas réel de `markForCheck()` | [`legacy-tick-counter.ts`](src/app/shared/ui/legacy-tick-counter/legacy-tick-counter.ts) |

## Point 3 — Injection de dépendances moderne

| Sujet | Fichier |
|---|---|
| `inject()` en fonction | partout — ex. [`task-board.ts`](src/app/features/tasks/containers/task-board/task-board.ts) |
| Service global `providedIn: 'root'` | [`user-preferences.service.ts`](src/app/core/services/user-preferences.service.ts) |
| Service scopé à la route | [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) déclaré, [`tasks.routes.ts`](src/app/features/tasks/tasks.routes.ts) `providers: [TaskStore]` |
| Guard fonctionnel (`CanActivateFn`) | [`tasks-access.guard.ts`](src/app/core/guards/tasks-access.guard.ts) |

### Bonus — cas d'`InjectionToken` (si le temps le permet)

| Sujet | Fichier |
|---|---|
| Token pour une valeur sans classe (`window`) | [`window.token.ts`](src/app/core/tokens/window.token.ts), consommé dans [`legacy-tick-counter.ts`](src/app/shared/ui/legacy-tick-counter/legacy-tick-counter.ts) |
| Token multi-provider (façon `NG_VALIDATORS`) | [`task-title-validators.token.ts`](src/app/features/tasks/data-access/task-title-validators.token.ts), enregistré dans [`tasks.routes.ts`](src/app/features/tasks/tasks.routes.ts) (`multi: true`), consommé dans [`task-store.service.ts`](src/app/features/tasks/data-access/task-store.service.ts) |

## Point 4 — Pattern smart/dumb

| Rôle | Fichier |
|---|---|
| Smart (container) | [`task-board.ts`](src/app/features/tasks/containers/task-board/task-board.ts) + [`task-board.html`](src/app/features/tasks/containers/task-board/task-board.html) |
| Dumb — `input()`/`output()` | [`task-filter-bar.ts`](src/app/shared/ui/task-filter-bar/task-filter-bar.ts), [`task-create-form.ts`](src/app/shared/ui/task-create-form/task-create-form.ts) |
| Dumb — `model()` + état UI local | [`task-item.ts`](src/app/shared/ui/task-item/task-item.ts) (`done`, `isEditing`) |

## Point 5 — Pipes et directives (exemples débutant)

| Sujet | Fichier | Repère |
|---|---|---|
| Pipe custom pur | [`relative-time.pipe.ts`](src/app/shared/pipes/relative-time.pipe.ts) | `RelativeTimePipe`, utilisé dans [`task-item.html`](src/app/shared/ui/task-item/task-item.html) |
| Pipe natif (`date`) | [`task-item.html`](src/app/shared/ui/task-item/task-item.html) | attribut `title` de la tâche |
| Directive d'attribut custom (`host` + `input()`) | [`highlight.directive.ts`](src/app/shared/directives/highlight.directive.ts) | `HighlightDirective`, sur le titre de tâche ([`task-item.html`](src/app/shared/ui/task-item/task-item.html)) et sur "Diagnostics" avec une couleur personnalisée ([`task-board.html`](src/app/features/tasks/containers/task-board/task-board.html)) |


## Autres ressources

- [`README.md`](README.md) — description du projet et instructions de démarrage
- [`Angular Training — Signals, détection, DI.pptx`](Angular Training — Signals, détection, DI.pptx) — support de suivi de la formation
