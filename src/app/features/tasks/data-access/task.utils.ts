import { Task } from './task.model';

/** Custom `equal` for a signal/computed holding an array: content-based instead of reference-based. */
export function sameTasks(a: readonly Task[], b: readonly Task[]): boolean {
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  return a.every((task, index) => {
    const other = b[index];
    return task.id === other.id && task.title === other.title && task.done === other.done;
  });
}
