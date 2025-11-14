import { Exercise as IExercise } from "./exercise.interface";
import { CompletedExercise } from "./completedExercise.interface";
import { CompletedSet } from "./completedSets.interface";
import { CompletedOccasion } from "./completedOccasion.interface";

// Implementerar CompletedExercise-interfacet med getters och setters
export class CompletedExerciseModel implements CompletedExercise {
    // Ändrat till privata egenskaper med '_' prefix
    private _uuid: string;
    private _lookupId: string;
    private _exercise: IExercise;
    private _occasion: CompletedOccasion[];

    constructor(
        uuid: string,
        lookupId: string,
        exercise: IExercise,
        occassion: CompletedOccasion[],
    ) {
        // Initiera de privata egenskaperna i konstruktorn
        this._uuid = uuid;
        this._lookupId = lookupId,
        this._exercise = exercise;
        this._occasion = occassion;
    }

    // --- Getters (Läs-åtkomst) ---
    // ÄNDRAD TILL TS-GETTER (t.ex. 'get uuid()')

    public get uuid(): string {
        return this._uuid;
    }

    public get lookupId(): string {
        return this.lookupId;
    }

    public get exercise(): IExercise {
        return this._exercise;
    }

    public get occasion(): CompletedOccasion[] {
        return this._occasion;
    }


    // --- Setters (Skriv-åtkomst) ---
    // ÄNDRAD TILL TS-SETTER (t.ex. 'set uuid()')
    
    public set uuid(value: string) {
        this._uuid = value;
    }

    public set lookupId(value: string) {
        this._lookupId = value;
    }

    public set exercise(value: IExercise) {
        this._exercise = value;
    }

    /*
    public set date(value: Date) {
        // Exempel på validering: Se till att datumet är ett giltigt Date-objekt
        if (isNaN(value.getTime())) {
            throw new Error("Ogiltigt datum angivet.");
        }
        this._date = value;
    }
        */

    public set occasion(value: CompletedOccasion[]) {
        // Exempel på validering: Säkerställ att listan inte är null/undefined, men tillåter tom lista
        if (!Array.isArray(value)) {
            throw new Error("Sets måste vara en lista.");
        }
        this._occasion = value;
    }

    /*
    public set note(value: string | undefined) {
        this._note = value;
    }
    */

    // --- Hjälpmetod (exempel) ---
    
    /**
     * Lägger till ett nytt set i listan.
     * @param set Det genomförda setet som ska läggas till.
     */
    public addOccasion(occasion: CompletedOccasion): void {
        this._occasion.push(occasion);
    }
}