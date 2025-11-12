import { DataService } from '@/pages/service/data-service';
import { Exercise } from '@/types';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, filter, Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-excercise-component',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search-excercise-component.html',
  styleUrl: './search-excercise-component.scss'
})
export class SearchExcerciseComponent {


  constructor(
    private dataService: DataService
  ) { }

  searchControl = new FormControl<string>('', {
    asyncValidators: [],
    validators: [],
    nonNullable: true,
  });

  searchTerm: string = '';
  searchResults: any[] = [];
  loading = false;
  selectedExercise: Exercise | null = null;
  showGif: boolean = false;
  colors: string[] = ["blue", "green","yellow", "cyan", "pink", "purple"];
  private sub?: Subscription;



  // Denna funktion anropas när användaren skriver i sökfältet
  onSearchChange(): void {
    if (this.searchControl.value.length < 3) {
      this.searchResults = [];
      return;
    }

    this.sub = this.searchControl.valueChanges
      .pipe(
        //debounceTime(300),                // vänta 300 ms
        distinctUntilChanged(),           // sök inte samma text igen
        // narrow the value to a string so TypeScript knows `query` has `length`
        filter((query): query is string => typeof query === 'string' && query.length >= 3)   // minst 3 tecken
      )
      .subscribe(query => this.performSearch(query));
  }

  async performSearch(searchquery: string) {
    this.loading = true;
    this.searchResults = this.dataService.filterItemsByName(searchquery);
    this.loading = false;
    console.log('Filtrerade resultat:', this.searchResults);
  }


  toggleGif() {
    this.showGif = !this.showGif;
    let seconds = 7;
    const interval = setInterval(() => {
      console.log(seconds); // Visar nedräkningen i konsolen
      seconds--;
      if (seconds < 0) {
        this.showGif = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  showPopup(passsedVal: string) {
    alert(passsedVal);
  }


}
