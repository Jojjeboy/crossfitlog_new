import { Exercise as IExercise } from "./excercise.interface";
import { CompletedExercise } from "./completedExcercise.interface";
import { CompletedSet } from "./completedSets.interface";

// Implementerar CompletedExercise-interfacet med getters och setters
export class CompletedExerciseModel implements CompletedExercise {
    // Ändrat till privata egenskaper med '_' prefix
    private _uuid: string;
    private _exercise: IExercise;
    private _date: Date;
    private _sets: CompletedSet[];
    private _note?: string; // Valfri egenskap

    constructor(
        uuid: string,
        exercise: IExercise,
        date: Date,
        sets: CompletedSet[],
        note?: string
    ) {
        // Initiera de privata egenskaperna i konstruktorn
        this._uuid = uuid;
        this._exercise = exercise;
        this._date = date;
        this._sets = sets;
        this._note = note;
    }

    // --- Getters (Läs-åtkomst) ---

    public get uuid(): string {
        return this._uuid;
    }

    public get exercise(): IExercise {
        return this._exercise;
    }

    public get date(): Date {
        return this._date;
    }

    public get sets(): CompletedSet[] {
        return this._sets;
    }

    public get note(): string | undefined {
        return this._note;
    }

    // --- Setters (Skriv-åtkomst) ---
    
    public set uuid(value: string) {
        this._uuid = value;
    }

    public set exercise(value: IExercise) {
        this._exercise = value;
    }

    public set date(value: Date) {
        // Exempel på validering: Se till att datumet är ett giltigt Date-objekt
        if (isNaN(value.getTime())) {
            throw new Error("Ogiltigt datum angivet.");
        }
        this._date = value;
    }

    public set sets(value: CompletedSet[]) {
        // Exempel på validering: Säkerställ att listan inte är null/undefined, men tillåter tom lista
        if (!Array.isArray(value)) {
            throw new Error("Sets måste vara en lista.");
        }
        this._sets = value;
    }

    public set note(value: string | undefined) {
        this._note = value;
    }

    // --- Hjälpmetod (exempel) ---
    
    /**
     * Lägger till ett nytt set i listan.
     * @param set Det genomförda setet som ska läggas till.
     */
    public addSet(set: CompletedSet): void {
        this._sets.push(set);
    }
}