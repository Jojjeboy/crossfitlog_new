import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../models/excercise.interface';
import { ExcerciseModel } from '../models/excercise.model';
import { CompletedExerciseModel } from '../models/completedExcercise.model';
import { CompletedExercise } from '../models/completedExcercise.interface';


@Injectable({
  providedIn: 'root',
})
export class ExcerciseService implements OnDestroy{
  private jsonUrl = '/exercises.json'; // Sökväg till din JSON-fil
  private excercisesFromDb: ExcerciseModel[] = [];
  private completedExercises: ExcerciseModel[] = [];
  private excercisesCompleted: CompletedExerciseModel[] = [];
  private isLoaded = false;


  private readonly key = 'completedExercises';
  private excercisesSubject = new BehaviorSubject<ExcerciseModel[]>([]);
  private completedExcerciseSubject = new BehaviorSubject<CompletedExerciseModel[]>([]);
  excercises$ = this.excercisesSubject.asObservable();
  private storageSub?: Subscription;


  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) {
    this.loadDataFromDB();
    this.listenToStorageChanges();
  }

  loadFromStorage(): void{
    //const raw = this.storageService.get<CompletedExercise[]>(this.key);
    const raw = this.storageService.ensureArrayExists<CompletedExercise>(this.key);
    
    const models = raw ? raw.map(w => this.toCompletedExcerciseModel(w)) : [];
    this.completedExcerciseSubject.next(models);
  }

  // En metod för att ladda datan från db (jsonfil i detta fallet)
  loadDataFromDB(): void {
    // KORRIGERING: Vi måste prenumerera på HTTP-anropet och mappa inuti RxJS pipe.
    this.http.get<Exercise[]>(this.jsonUrl).pipe(
      // RAD 47 FIXAD: Mappa inkommande Exercise[] till ExcerciseModel[]
      map(rawExercises => rawExercises.map(w => this.toExcerciseModel(w)))
    ).subscribe(
      (models: ExcerciseModel[]) => {
        this.setData(models);
        this.excercisesSubject.next(models);
        this.isLoaded = true; // Markera som laddad efter lyckad laddning
      },
      error => {
        console.error('Kunde inte ladda övningar från JSON-fil:', error);
        this.isLoaded = false;
      }
    );
  }

  // En metod för att hämta den laddade datan
  getDataFromDB(): ExcerciseModel[] {
    return this.excercisesFromDb
  }

  // Sätter datan i minnet
  setData(data: ExcerciseModel[]): void {
    this.excercisesFromDb = data;
    this.isLoaded = true;
  }


  // Hämta ett objekt baserat på dess sträng id
  getItemById(id: string): Exercise | undefined {
    // Använder Array.prototype.find() för att söka igenom arrayen
    return this.excercisesFromDb.find(item => item.exerciseId === id);
  }


  /**
   * Filtrerar Item från den laddade datan baserat på en söksträng i 'name'-attributet.
   * Sökningen är skiftlägesokänslig (case-insensitive).
   * @param searchTerm Strängen att söka efter.
   * @returns Exercise[] En array med matchande objekt.
   */
  filterItemsByName(searchTerm: string): Exercise[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.excercisesFromDb; // Returnera allt om söksträngen är tom
    }

    const lowerCaseSearch = searchTerm.toLowerCase().trim();

    // Använder Array.prototype.filter() för att söka igenom arrayen
    return this.excercisesFromDb.filter((item: { name: string; }) => {
      // Kontrollerar om namnet innehåller söksträngen
      return item.name.toLowerCase().includes(lowerCaseSearch);
    });
  }

  // Svarar på om datan är laddad
  getIsLoaded(): boolean {
    return this.isLoaded;
  }


  private listenToStorageChanges(): void {
    this.storageSub = fromEvent<StorageEvent>(window, 'storage')
      .pipe(filter(event => event.key === this.key))
      .subscribe(() => this.loadFromStorage());
  }

  // KORRIGERING: Returtypen måste vara CompletedExerciseModel för att matcha arrayen den fyller
  private toCompletedExcerciseModel(completedExcercise: CompletedExercise): CompletedExerciseModel {
    // Behöver även hantera att date i interfacet är Date, men när det hämtas från 
    // localStorage är det en sträng. Vi konverterar till Date igen.
    const date = new Date(completedExcercise.date);

    return new CompletedExerciseModel(
      completedExcercise.uuid,
      completedExcercise.exercise,
      date, // Använder det konverterade Date-objektet
      completedExcercise.sets,
      completedExcercise.note
    );
  }

    private toExcerciseModel(excercise: Exercise): ExcerciseModel {
    return new ExcerciseModel(
      excercise.exerciseId,
      excercise.name,
      excercise.gifUrl,
      excercise.equipments,
      excercise.bodyParts,
      excercise.targetMuscles,
      excercise.secondaryMuscles,
      excercise.instructions
    );
  }


  ngOnDestroy(): void {
    this.storageSub?.unsubscribe();
  }
}