import { Exercise, BodyPart, Muscle, Equipment } from './excercise.interface';

export class ExcerciseModel implements Exercise {
    private _exerciseId: string;
    private _name: string;
    private _gifUrl: string;
    private _equipments: Equipment;
    private _bodyParts: BodyPart;
    private _targetMuscles: Muscle;
    private _secondaryMuscles: Muscle;
    private _instructions: string[];

    constructor(
        exerciseId: string,
        name: string,
        gifUrl: string,
        equipments: Equipment,
        bodyParts: BodyPart,
        targetMuscles: Muscle,
        secondaryMuscles: Muscle,
        instructions: string[]
    ) {
        this._exerciseId = exerciseId;
        this._name = name;
        this._gifUrl = gifUrl;
        this._equipments = equipments;
        this._bodyParts = bodyParts;
        this._targetMuscles = targetMuscles;
        this._secondaryMuscles = secondaryMuscles;
        this._instructions = instructions;
    }

    // --- Getters (Läs-åtkomst) ---

    public get exerciseId(): string {
        return this._exerciseId;
    }

    public get name(): string {
        return this._name;
    }

    public get gifUrl(): string {
        return this._gifUrl;
    }

    public get equipments(): Equipment {
        return this._equipments;
    }

    public get bodyParts(): BodyPart {
        return this._bodyParts;
    }

    public get targetMuscles(): Muscle {
        return this._targetMuscles;
    }

    public get secondaryMuscles(): Muscle {
        return this._secondaryMuscles;
    }

    public get instructions(): string[] {
        return this._instructions;
    }

    // --- Setters (Skriv-åtkomst) ---

    // Setter för 'exerciseId' (kan göras skyddad om ID inte ska ändras)
    public set exerciseId(value: string) {
        this._exerciseId = value;
    }

    // Setter för 'name' (kan inkludera validering)
    public set name(value: string) {
        if (value.trim().length === 0) {
            throw new Error("Namn får inte vara tomt.");
        }
        this._name = value;
    }

    public set gifUrl(value: string) {
        this._gifUrl = value;
    }

    public set equipments(value: Equipment) {
        this._equipments = value;
    }

    public set bodyParts(value: BodyPart) {
        this._bodyParts = value;
    }

    public set targetMuscles(value: Muscle) {
        this._targetMuscles = value;
    }

    public set secondaryMuscles(value: Muscle) {
        this._secondaryMuscles = value;
    }

    public set instructions(value: string[]) {
        this._instructions = value;
    }
}