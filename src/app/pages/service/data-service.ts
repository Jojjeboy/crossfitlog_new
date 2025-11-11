import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = '/exercises.json'; // Sökväg till din JSON-fil
  private data: Exercise[] = [];
  private isLoaded = false;

  constructor(private http: HttpClient) { }

  // En metod för att ladda datan
  loadData(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.jsonUrl);
  }

  // En metod för att hämta den laddade datan
  getData(): Exercise[] {
    return this.data;
  }

  // Sätter datan i minnet
  setData(data: Exercise[]): void {
    this.data = data;
    this.isLoaded = true;
  }

  // Hämta ett objekt baserat på dess sträng id
  getItemById(id: string): Exercise | undefined {
    // Använder Array.prototype.find() för att söka igenom arrayen
    return this.data.find(item => item.exerciseId === id);
  }


  /**
   * Filtrerar Item från den laddade datan baserat på en söksträng i 'name'-attributet.
   * Sökningen är skiftlägesokänslig (case-insensitive).
   * @param searchTerm Strängen att söka efter.
   * @returns Exercise[] En array med matchande objekt.
   */
  filterItemsByName(searchTerm: string): Exercise[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.data; // Returnera allt om söksträngen är tom
    }

    const lowerCaseSearch = searchTerm.toLowerCase().trim();

    // Använder Array.prototype.filter() för att söka igenom arrayen
    return this.data.filter(item => {
      // Kontrollerar om namnet innehåller söksträngen
      return item.name.toLowerCase().includes(lowerCaseSearch);
    });
  }

  // Svarar på om datan är laddad
  getIsLoaded(): boolean {
    return this.isLoaded;
  }
}

