import { Pipe, PipeTransform } from '@angular/core';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Beginner example — pipe custom pur : transforme un timestamp (`number`)
 * en libellé relatif court ("à l'instant", "il y a 5 min", ...). Pas besoin
 * de `pure: false` : comme un `computed()`, Angular ne rappelle `transform()`
 * que si la référence de `value` change — voir README point 5.
 */
@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: number): string {
    const elapsed = Date.now() - value;

    if (elapsed < MINUTE) {
      return "à l'instant";
    }
    if (elapsed < HOUR) {
      return `il y a ${Math.floor(elapsed / MINUTE)} min`;
    }
    if (elapsed < DAY) {
      return `il y a ${Math.floor(elapsed / HOUR)} h`;
    }
    return `il y a ${Math.floor(elapsed / DAY)} j`;
  }
}
