import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CompletedOccasion } from '../../models/completedOccasion.interface'
import { CompletedSet } from "../../models/completedSets.interface";
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Badge } from "primeng/badge";
import { CommonModule } from '@angular/common';
import { ExerciseService } from '@/pages/service/exercise.service';




@Component({
  selector: 'app-occasion-form-component',
  imports: [ReactiveFormsModule, DatePickerModule, InputNumberModule, ButtonModule, Badge, CommonModule],
  templateUrl: './occasion-form-component.html',
  styleUrl: './occasion-form-component.scss'
})

export class OccasionFormComponent implements OnInit {

  // Huvudformulärkontrollen
  occasionForm!: FormGroup;
  maxDate: Date | undefined;

  @Input() lookUpId?: string;
  @Output() notifyParent: EventEmitter<string> = new EventEmitter<string>();




  constructor(
    private fb: FormBuilder,
    private exerciseService: ExerciseService
  ) { }

  /**
   * Initializes the component, sets the maximum selectable date to today,
   * and creates the main form structure.
   */
  ngOnInit(): void {
    let today = new Date();
    
    this.maxDate = new Date();
    this.maxDate.setDate(today.getDate());
    this.maxDate.setMonth(today.getMonth());
    this.maxDate.setFullYear(today.getFullYear());

    this.occasionForm = this.fb.group({
      // Vi sätter upp detta som en FormArray för att hantera en lista av tillfällen
      occasions: this.fb.array([
        this.createOccasionGroup() // Starta med minst ett tillfälle
      ])
    });
  }

  /**
   * Getter for easy access to the 'occasions' FormArray from the template.
   * @returns {FormArray} The FormArray controlling the list of occasions.
   */
  get occasions(): FormArray {
    return this.occasionForm.get('occasions') as FormArray;
  }

  /**
   * Creates a FormGroup for a single occasion.
   * Each occasion includes a date, an optional note, and an array of sets.
   * It starts with one set by default.
   * @returns {FormGroup} A new FormGroup for an occasion.
   */
  createOccasionGroup(): FormGroup {
    return this.fb.group({
      // date måste vara null/tom för att passa PrimeNG Calendar (Date/string)
      date: [new Date(), Validators.required],
      note: [''], // Valfri anteckning
      sets: this.fb.array([
        this.createSetGroup() // Starta varje tillfälle med minst ett set
      ])
    });
  }

  /**
   * Creates a FormGroup for a single set, including reps and weight.
   * Both fields are required.
   * @returns {FormGroup} A new FormGroup for a set.
   */
  createSetGroup(): FormGroup {
    return this.fb.group({
      reps: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(0)]]
    });
  }

  // --- Metoder för att manipulera Occasions (Tillfällen) ---

  /**
   * Adds a new occasion group to the 'occasions' FormArray.
   */
  addOccasion(): void {
    this.occasions.push(this.createOccasionGroup());
  }

  /**
   * Removes an occasion from the 'occasions' FormArray at a specific index.
   * @param {number} occasionIndex The index of the occasion to remove.
   */
  removeOccasion(occasionIndex: number): void {
    this.occasions.removeAt(occasionIndex);
  }

  // --- Metoder för att manipulera Sets ---

  /**
   * Retrieves the 'sets' FormArray from a given occasion's FormGroup.
   * @param {AbstractControl} occasionControl The FormGroup for a specific occasion.
   * @returns {FormArray} The FormArray for the sets within that occasion.
   */
  getSets(occasionControl: AbstractControl): FormArray {
    return occasionControl.get('sets') as FormArray;
  }

  /**
   * Adds a new set group to the 'sets' FormArray of a specific occasion.
   * @param {AbstractControl} occasionControl The FormGroup for the occasion where the set will be added.
   */
  addSet(occasionControl: AbstractControl): void {
    this.getSets(occasionControl).push(this.createSetGroup());
  }

  /**
   * Removes a set from the 'sets' FormArray of a specific occasion.
   * @param {AbstractControl} occasionControl The FormGroup for the occasion.
   * @param {number} setIndex The index of the set to remove.
   */
  removeSet(occasionControl: AbstractControl, setIndex: number): void {
    this.getSets(occasionControl).removeAt(setIndex);
  }


  /**
   * Counts the number of sets within a given occasion's FormGroup.
   * @param {AbstractControl} occasionControl The FormGroup for a specific occasion.
   * @returns {number} The total number of sets for that occasion.
   */
  countSets(occasionControl: AbstractControl): number {
    const sets = this.getSets(occasionControl).value;
    if (sets && Array.isArray(sets)) {
      return sets.length;
    }
    return 0;
  }

  /**
   * Handles the form submission.
   * If the form is valid, it logs the form data.
   * If the form is invalid, it logs an error and marks all fields as touched to display validation errors.
   */
  onSubmit(): void {
    if (this.occasionForm.valid) {
      const formValue = this.occasionForm.value;
      console.log('Sparad data:', formValue);

      const occasions: CompletedOccasion[] = formValue.occasions;
      occasions.forEach(occasion => {
        this.exerciseService.addCompletedExercise(this.lookUpId as string, occasion);
      });

      // Här skulle du normalt skicka formValue.occasions till din backend
      this.createSetGroup();
      this.occasionForm.reset();
      this.notifyParent.emit(formValue.toString());


    } else {
      console.error('Formuläret är inte giltigt!');
      // Markera fält som ogiltiga för att visa felmeddelanden
      this.occasionForm.markAllAsTouched();
    }
  }

}