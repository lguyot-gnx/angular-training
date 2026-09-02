import { Injectable } from '@angular/core';

/** Thin wrapper so features never touch the Web Storage API directly. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  getItem<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
