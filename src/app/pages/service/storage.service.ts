import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class StorageService {
  set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Kollar om det finns något sparat värde i localStorage för den angivna nyckeln
   */
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Säkerställer att det finns en array sparad under angiven nyckel.
   * Om inget finns, skapas en tom array och returneras.
   * Om något finns, returneras den befintliga arrayen.
   * @param key Nyckeln att kontrollera eller skapa
   * @returns Den befintliga eller nyskapade arrayen
   */
  ensureArrayExists<T>(key: string): T[] {
    if (!this.exists(key)) {
      const emptyArray: T[] = [];
      this.set(key, emptyArray);
      return emptyArray;
    }

    const existing = this.get<T[]>(key);
    return existing ?? [];
  }
}
