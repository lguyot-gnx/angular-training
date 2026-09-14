import { Directive, input, signal } from '@angular/core';

/**
 * Beginner example — directive d'attribut : surligne son hôte au survol.
 * Le nom de l'input reprend le nom du sélecteur (`appHighlight`), ce qui
 * permet d'écrire directement `[appHighlight]="'#e0f2fe'"` sans nom de
 * binding séparé — un pattern classique des directives Angular.
 *
 * Tout passe par le `host` object (bindings + listeners), exactement comme
 * pour un composant : pas d'ElementRef/Renderer2 nécessaire pour un effet
 * aussi simple — voir README point 5.
 */
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.background-color]': 'isHovered() ? appHighlight() : null',
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
  },
})
export class HighlightDirective {
  readonly appHighlight = input('#fff3cd');

  protected readonly isHovered = signal(false);
}
