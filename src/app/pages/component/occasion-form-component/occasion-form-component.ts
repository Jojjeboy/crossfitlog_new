import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CompletedOccasion } from '../../models/completedOccasion.interface'
import { CompletedSet } from "../../models/completedSets.interface";
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Badge } from "primeng/badge";
import { CommonModule } from '@angular/common';




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


  constructor(private fb: FormBuilder) { }

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

  // Getter för att enkelt komma åt FormArray-kontrollen i HTML
  get occasions(): FormArray {
    return this.occasionForm.get('occasions') as FormArray;
  }

  // Skapar en FormGroup för ett enskilt CompletedOccasion
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

  // Skapar en FormGroup för ett enskilt CompletedSet (reps & weight)
  createSetGroup(): FormGroup {
    return this.fb.group({
      reps: [null, [Validators.required, Validators.min(1)]],
      weight: [null, [Validators.required, Validators.min(0)]]
    });
  }

  // --- Metoder för att manipulera Occasions (Tillfällen) ---

  addOccasion(): void {
    this.occasions.push(this.createOccasionGroup());
  }

  removeOccasion(occasionIndex: number): void {
    this.occasions.removeAt(occasionIndex);
  }

  // --- Metoder för att manipulera Sets ---

  // Hämta FormArray för sets inom ett specifikt tillfälle
  getSets(occasionControl: AbstractControl): FormArray {
    return occasionControl.get('sets') as FormArray;
  }

  addSet(occasionControl: AbstractControl): void {
    this.getSets(occasionControl).push(this.createSetGroup());
  }

  removeSet(occasionControl: AbstractControl, setIndex: number): void {
    this.getSets(occasionControl).removeAt(setIndex);
  }

  // --- Hantera sparning ---

  onSubmit(): void {
    if (this.occasionForm.valid) {
      const formValue = this.occasionForm.value;
      console.log('Sparad data:', formValue);

      // Här skulle du normalt skicka formValue.occasions till din backend

    } else {
      console.error('Formuläret är inte giltigt!');
      // Markera fält som ogiltiga för att visa felmeddelanden
      this.occasionForm.markAllAsTouched();
    }
  }
}