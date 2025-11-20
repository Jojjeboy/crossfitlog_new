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
export class ExerciseService implements OnDestroy {
  private jsonUrl = '/exercises.json'; // Sökväg till din JSON-fil
  private exercisesFromDb: ExerciseModel[] = [];
  private completedExercises: ExerciseModel[] = [];
  private exercisesCompleted: CompletedExerciseModel[] = [];
  private favouriteExercises: ExerciseModel[] = [];
  private isLoaded = false;


  private readonly key = 'completedExercises';
  private readonly favKey = 'favouriteExercises';
  private exercisesSubject = new BehaviorSubject<ExerciseModel[]>([]);
  private completedExerciseSubject = new BehaviorSubject<CompletedExerciseModel[]>([]);
  private favouriteExerciseSubject = new BehaviorSubject<ExerciseModel[]>([]);
  exercises$ = this.exercisesSubject.asObservable();
  completedExercise$ = this.completedExerciseSubject.asObservable();
  favouriteExercise$ = this.favouriteExerciseSubject.asObservable();
  private storageSub?: Subscription;


  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Listan över alla övningar som finns ligger i exercise.json. Den behöver laddas in
    this.loadDataFromDB();
    this.listenToStorageChanges();
  }

  /**
   * Laddar slutförda övningar från webbläsarens lokala lagring (localStorage).
   * Metoden verifierar först att övningsdatabasen är laddad för att kunna mappa historik korrekt.
   * Den transformerar rådata till `CompletedExerciseModel`-instanser.
   * Inga parametrar.
   * Returnerar ingenting (`void`).
   */
  loadFromStorage(): void {
    // Vi kollar först om övningsdatabasen är laddad, annars kan vi inte mappa historik korrekt.
    if (!this.isLoaded) {
      console.warn('Försöker ladda historik innan övningsdatabasen är klar.');
      // Vi kan välja att kasta fel här, men vi låter den fortsätta för att undvika krasch.
    }

    const raw = this.storageService.ensureArrayExists<CompletedExercise>(this.key);

    // Mappningen anropar toCompletedExerciseModel som anropar getItemById
    const models = raw ? raw.map(w => this.toCompletedExerciseModel(w)) : [];
    this.completedExerciseSubject.next(models);

    const rawFav = this.storageService.ensureArrayExists<Exercise>(this.favKey);
    const modelsFav = rawFav ? rawFav.map(wF => this.toExerciseModel(wF)) : [];
    this.favouriteExerciseSubject.next(modelsFav);
  }

  /**
   * Laddar övningsdata från en JSON-fil.
   * Datan omvandlas till `ExerciseModel`-instanser och lagras i minnet.
   * Efter att datan har laddats, anropas `loadFromStorage` för att ladda historik.
   * Inga parametrar.
   * Returnerar ingenting (`void`).
   */
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


  /**
   * Hämtar all övningsdata som finns lagrad i minnet.
   * Inga parametrar.
   * @returns {ExerciseModel[]} En array med alla `ExerciseModel`-objekt.
   */
  getDataFromDB(): ExerciseModel[] {
    return this.exercisesFromDb
  }

  /**
   * Sparar en array av övningsdata i minnet och markerar datan som laddad.
   * @param {ExerciseModel[]} data - En array av `ExerciseModel`-objekt att spara.
   * Returnerar ingenting (`void`).
   */
  setData(data: ExerciseModel[]): void {
    this.exercisesFromDb = data;
    this.isLoaded = true;
  }

  /**
   * Hämtar ett specifikt övningsobjekt baserat på dess ID.
   * @param {string} id - ID för övningen som ska hämtas.
   * @returns {ExerciseModel | undefined} Det matchande `ExerciseModel`-objektet, eller `undefined` om det inte hittas.
   */
  getItemById(id: string): ExerciseModel | undefined {
    // this.exercisesFromDb är nu garanterat laddad/satt (även om den är tom) 
    // när loadFromStorage körs.
    return this.exercisesFromDb.find(item => item.exerciseId === id);
  }

  /**
   * Hämtar en specifik slutförd övning baserat på dess ID.
   * @param {string} id - ID för den slutförda övningen att hämta.
   * @returns {CompletedExerciseModel | undefined} Det matchande `CompletedExerciseModel`-objektet, eller `undefined` om det inte hittas.
   */
  getCompletedExcerciseById(id: string): ExerciseModel | undefined {
    return this.favouriteExercises.find(item => item.exerciseId === id);
  }



  /**
   * Filtrerar övningar baserat på ett sökord.
   * Sökningen är skiftlägesokänslig och matchar mot övningens namn.
   * @param {string} searchTerm - Sökordet som ska användas för filtrering.
   * @returns {ExerciseModel[]} En array med `ExerciseModel`-objekt som matchar sökordet. Om sökordet är tomt returneras alla övningar.
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

  /**
   * Kontrollerar om den initiala övningsdatan har laddats från JSON-filen.
   * Inga parametrar.
   * @returns {boolean} `true` om datan är laddad, annars `false`.
   */
  getIsLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Lyssnar efter ändringar i webbläsarens lokala lagring (localStorage).
   * Om en ändring sker för nyckeln 'completedExercises', anropas `loadFromStorage` för att synkronisera tillståndet.
   * Metoden är privat och anropas endast från konstruktorn.
   * Inga parametrar.
   * Returnerar ingenting (`void`).
   */
  private listenToStorageChanges(): void {
    this.storageSub = fromEvent<StorageEvent>(window, 'storage')
      .pipe(filter(event => event.key === this.key))
      .subscribe(() => this.loadFromStorage());
  }

  /**
   * Skapar en tom `ExerciseModel` som används som fallback om en övning inte kan hittas.
   * Detta förhindrar krascher om historikdata refererar till ett borttaget övnings-ID.
   * Metoden är privat.
   * Inga parametrar.
   * @returns {ExerciseModel} En instans av `ExerciseModel` med standardvärden för en saknad övning.
   */
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

  /**
   * Omvandlar ett rått `CompletedExercise`-objekt från lagring till en `CompletedExerciseModel`.
   * Metoden kopplar den slutförda övningen till dess fullständiga övningsdata (`ExerciseModel`).
   * Om övningsdatan inte hittas används en tom fallback-modell.
   * Metoden är privat.
   * @param {CompletedExercise} completedExercise - Det råa objektet från lagring.
   * @returns {CompletedExerciseModel} En fullständig instans av `CompletedExerciseModel`.
   */
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
   * Lägger till ett nytt slutfört träningstillfälle för en övning.
   * Om övningen redan har slutförts tidigare, läggs det nya tillfället till i historiken.
   * Annars skapas en ny post för den slutförda övningen.
   * @param {string} lookupId - ID för övningen som slutfördes.
   * @param {CompletedOccasion} occasion - Data om det slutförda träningstillfället (datum, set, etc.).
   * Returnerar ingenting (`void`).
   */
  addCompletedExercise(lookupId: string, occasion: CompletedOccasion): void {
    const exercise = this.getItemById(lookupId);
    if (!exercise) {
      console.error(`Could not find exercise with ID: ${lookupId}`);
      return;
    }

    const currentCompleted = this.completedExerciseSubject.getValue();
    const existingExercise = currentCompleted.find(e => e.lookupId === lookupId);

    if (existingExercise) {
      existingExercise.addOccasion(occasion);
      this.completedExerciseSubject.next([...currentCompleted]);
    } else {
      // Create a new model for the completed exercise.
      const newCompletedExercise = new CompletedExerciseModel(
        crypto.randomUUID(), // Generate a unique ID for this completion
        lookupId,
        exercise,
        []
      );
      newCompletedExercise.addOccasion(occasion);
      this.completedExerciseSubject.next([...currentCompleted, newCompletedExercise]);
    }
    this.saveCompletedExercises();
  }



  toggleFavourite(exerciseId: string): void {
    const favoriteExercises = this.favouriteExerciseSubject.getValue();
    const exercise = this.getItemById(exerciseId);
    if (!exercise) {
      return;
    }
    const existingExercise = favoriteExercises.find(e => e.exerciseId === exercise.exerciseId);

    if (!existingExercise) {
      this.favouriteExerciseSubject.next([...favoriteExercises, exercise]);
    }
    else {
      this.favouriteExerciseSubject.next(favoriteExercises.filter(e => e.exerciseId !== exercise.exerciseId));
    }
    this.saveFavouriteExercises();

  }

  isExerciseInFavorites(id: string): boolean {
    const favoriteExercises = this.favouriteExerciseSubject.getValue();
    return favoriteExercises.some(exercise => exercise.exerciseId === id);
  }

  /**
   * Sparar den nuvarande listan av slutförda övningar till webbläsarens lokala lagring.
   * Datan omvandlas till ett format som är lämpligt för JSON-serialisering.
   * Metoden är privat.
   * Inga parametrar.
   * Returnerar ingenting (`void`).
   */
  private saveCompletedExercises(): void {
    const completedExercises = this.completedExerciseSubject.getValue();
    const dataToSave = completedExercises.map(model => ({
      uuid: model.uuid,
      lookupId: model.lookupId,
      occasion: model.occasion,
    }));
    this.storageService.set(this.key, dataToSave);
  }


  private saveFavouriteExercises(): void {
    const favouriteExercises = this.favouriteExerciseSubject.getValue();
    const dataToSave = favouriteExercises.map(model => ({
      exerciseId: model.exerciseId,
      name: model.name,
      gifUrl: model.gifUrl,
      equipments: model.equipments,
      bodyParts: model.bodyParts,
      targetMuscles: model.targetMuscles,
      secondaryMuscles: model.secondaryMuscles,
      instructions: model.instructions,
    }));

    this.storageService.set(this.favKey, dataToSave);
  }

  /**
   * Omvandlar ett rått `Exercise`-objekt (från JSON) till en `ExerciseModel`.
   * Metoden är privat och används för att standardisera övningsdata internt.
   * @param {Exercise} exercise - Det råa övningsobjektet.
   * @returns {ExerciseModel} En instans av `ExerciseModel`.
   */
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

  /**
   * Städar upp prenumerationer när komponenten förstörs för att förhindra minnesläckor.
   * Inga parametrar.
   * Returnerar ingenting (`void`).
   * @returns void
   */
  ngOnDestroy(): void {
    this.storageSub?.unsubscribe();
  }
}