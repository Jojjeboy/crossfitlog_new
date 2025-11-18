import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../models/exercise.interface';
import { ExerciseModel } from '../models/exercise.model';
import { CompletedExerciseModel } from '../models/completedExercise.model';
import { CompletedExercise } from '../models/completedExercise.interface';
import { CompletedOccasion } from '../models/completedOccasion.interface';


@Injectable({
  providedIn: 'root',
})
export class ExerciseService implements OnDestroy{
  private jsonUrl = '/exercises.json'; // Sökväg till din JSON-fil
  private exercisesFromDb: ExerciseModel[] = [];
  private completedExercises: ExerciseModel[] = [];
  private exercisesCompleted: CompletedExerciseModel[] = [];
  private isLoaded = false;


  private readonly key = 'completedExercises';
  private exercisesSubject = new BehaviorSubject<ExerciseModel[]>([]);
  private completedExerciseSubject = new BehaviorSubject<CompletedExerciseModel[]>([]);
  exercises$ = this.exercisesSubject.asObservable();
  completedExercise$ = this.completedExerciseSubject.asObservable();
  private storageSub?: Subscription;


  constructor(
    private http: HttpClient, 
    private storageService: StorageService
  ) {
    // VI BEHÅLLER DENNA: Övningsdata måste starta laddningen direkt
    this.loadDataFromDB();
    this.listenToStorageChanges();
  }

  loadFromStorage(): void{
    // Vi kollar först om data finns, annars försöker vi inte ladda historiken.
    if (!this.isLoaded) {
        console.warn('Försöker ladda historik innan övningsdatabasen är klar.');
        // Vi kan välja att kasta fel här, men vi låter den fortsätta för att undvika krasch.
    }
    
    const raw = this.storageService.ensureArrayExists<CompletedExercise>(this.key);
    
    // Mappningen anropar toCompletedExerciseModel som anropar getItemById
    const models = raw ? raw.map(w => this.toCompletedExerciseModel(w)) : [];
    this.completedExerciseSubject.next(models);
  }

  // En metod för att ladda datan från db (jsonfil i detta fallet)
  loadDataFromDB(): void {
    this.http.get<Exercise[]>(this.jsonUrl).pipe(
      map(rawExercises => rawExercises.map(w => this.toExerciseModel(w)))
    ).subscribe(
      (models: ExerciseModel[]) => {
        this.setData(models);
        this.exercisesSubject.next(models);
        this.isLoaded = true; // Markera som laddad efter lyckad laddning
        
        // FIXAD BEROENDE: Ladda historik HÄR, så att this.exercisesFromDb är redo
        this.loadFromStorage(); 
      },
      error => {
        console.error('Kunde inte ladda övningar från JSON-fil:', error);
        this.isLoaded = false;
      }
    );
  }

  // En metod för att hämta den laddade datan
  getDataFromDB(): ExerciseModel[] {
    return this.exercisesFromDb
  }

  // Sätter datan i minnet
  setData(data: ExerciseModel[]): void {
    this.exercisesFromDb = data;
    this.isLoaded = true;
  }


  // Hämta ett objekt baserat på dess sträng id
  // Ändrad returtyp till ExerciseModel för ökad tydlighet internt i servicen
  getItemById(id: string): ExerciseModel | undefined {
    // this.exercisesFromDb är nu garanterat laddad/satt (även om den är tom) 
    // när loadFromStorage körs.
    return this.exercisesFromDb.find(item => item.exerciseId === id);
  }


  /**
   * Filtrerar Item från den laddade datan baserat på en söksträng i 'name'-attributet.
   * Sökningen är skiftlägesokänslig (case-insensitive).
   * @param searchTerm Strängen att söka efter.
   * @returns ExerciseModel[] En array med matchande objekt.
   */
  filterItemsByName(searchTerm: string): ExerciseModel[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.exercisesFromDb; // Returnera allt om söksträngen är tom
    }

    const lowerCaseSearch = searchTerm.toLowerCase().trim();

    // Använder Array.prototype.filter() för att söka igenom arrayen
    return this.exercisesFromDb.filter((item: { name: string; }) => {
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

  // NY METOD: Skapar en tom ExerciseModel som fallback om data saknas
  private createEmptyExerciseModel(): ExerciseModel {
      return new ExerciseModel(
          'missing-id', 
          'Övning saknas', 
          '', 
          [], 
          [], 
          [], 
          [], 
          ['Detaljer kunde inte laddas. Kontrollera din historikdata.']
      );
  }

  // KORRIGERING: Returtypen måste vara CompletedExerciseModel för att matcha arrayen den fyller
  private toCompletedExerciseModel(completedExercise: CompletedExercise): CompletedExerciseModel {
    // 1. Deklarera variabeln i förväg
    let exerciseToDisplay: ExerciseModel | undefined;

    // 2. Använd if/else för tydlig kontroll (som önskat)
    if (completedExercise.lookupId) {
        // Om vi har en rå övning OCH den har ett ID, försök hämta den fullständiga modellen
        exerciseToDisplay = this.getItemById(completedExercise.lookupId) as ExerciseModel; 
    } else {
        // Annars, sätt till undefined
        exerciseToDisplay = undefined;
    }

    // 3. Konvertera datum (som fortfarande kan vara en sträng från localStorage)
    //const date = new Date(completedExercise.date);

    // 4. Returnera den nya modellen
    return new CompletedExerciseModel(
        completedExercise.uuid,
        completedExercise.lookupId,
        // Vi använder exerciseToDisplay om det finns, annars en tom modell
        exerciseToDisplay || this.createEmptyExerciseModel(),        
        completedExercise.occasion
    );
  }

  /**
   * Creates a new CompletedExerciseModel from an occasion and adds it to the state.
   * This method updates the completedExerciseSubject with the new list of completed exercises.
   * @param {string} exerciseId The ID of the exercise that was completed.
   * @param {CompletedOccasion} occasion The completed occasion data.
   */
  addCompletedExercise(lookupId: string, occasion: CompletedOccasion): void {
    const exercise = this.getItemById(lookupId);
    if (!exercise) {
      console.error(`Could not find exercise with ID: ${lookupId}`);
      return;
    }

    // Create a new model for the completed exercise.
    const newCompletedExercise = new CompletedExerciseModel(
      crypto.randomUUID(), // Generate a unique ID for this completion
      lookupId,
      exercise,
      []
    );
    newCompletedExercise.addOccasion(occasion);

    const currentCompleted = this.completedExerciseSubject.getValue();
    this.completedExerciseSubject.next([...currentCompleted, newCompletedExercise]);
  }

  private toExerciseModel(exercise: Exercise): ExerciseModel {
    return new ExerciseModel(
      exercise.exerciseId,
      exercise.name,
      exercise.gifUrl,
      exercise.equipments,
      exercise.bodyParts,
      exercise.targetMuscles,
      exercise.secondaryMuscles,
      exercise.instructions
    );
  }


  ngOnDestroy(): void {
    this.storageSub?.unsubscribe();
  }
}