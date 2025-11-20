import { CompletedExerciseModel } from '@/pages/models/completedExercise.model';
import { ChangeDetectorRef, Component, Input } from '@angular/core'; // **Lagt till ChangeDetectorRef**
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
import { List } from '../List';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from "primeng/treetable";
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { OccasionFormComponent } from "../occasion-form-component/occasion-form-component";
import { ExerciseService } from '@/pages/service/exercise.service';
import { ExcerciseDescription } from "../excercise-description/excercise-description";
import { FavoriteToggle } from "../favorite-toggle/favorite-toggle";



@Component({
  selector: 'app-list-completed-exercise-component',
  imports: [CommonModule, Dialog, TabsModule, AccordionModule, TableModule, TreeTableModule, CardModule, ChipModule, OccasionFormComponent, ExcerciseDescription, FavoriteToggle],
  templateUrl: './list-completed-exercise-component.html',
  styleUrl: './list-completed-exercise-component.scss'
})
export class ListCompletedExerciseComponent extends List {

  visible: boolean = false;
  @Input() completedExercises: CompletedExerciseModel[] = [];
  selectedExcercise?: CompletedExerciseModel;

  // **Lagt till konstruktor med ChangeDetectorRef**
  /**
   * Konstruktor för komponenten.
   * @param {ChangeDetectorRef} cdr - Angulars ChangeDetectorRef för att manuellt kunna trigga ändringsdetektering.
   * @param {ExerciseService} exerciseService - Service för att hantera övningsdata.
   */
  constructor(private cdr: ChangeDetectorRef, private exerciseService: ExerciseService) {
    super();
  }
  
  /**
   * Visar en dialogruta för en specifik slutförd övning.
   * @param {CompletedExerciseModel} completedExercise - Den slutförda övning som ska visas i dialogrutan.
   * Returnerar ingenting (`void`).
   */
  showDialog(completedExercise: CompletedExerciseModel) {
      this.visible = true;
      this.selectedExcercise = completedExercise;
  }

  /**
   * Hanterar händelsen när ett nytt träningstillfälle har lagts till från formulärkomponenten.
   * Stänger dialogrutan och triggar ändringsdetektering för att uppdatera vyn.
   * @param {any} newOccasion - Data om det nya tillfället (används för närvarande inte, men fångar händelsen).
   * Returnerar ingenting (`void`).
   */
  occasionAdded(newOccasion: any){
    console.log('Received message from child:', newOccasion);
    
    if (this.selectedExcercise) {
      // Valfritt, men kan vara bra i kombination med PrimeNG-komponenter
      this.cdr.detectChanges();
    }

    this.visible = false;
  }

  /**
   * Visar ett enkelt popup-fönster (alert) med ett meddelande.
   * @param {string} passsedVal - Textsträngen som ska visas i popup-fönstret.
   * Returnerar ingenting (`void`).
   */
  showPopup(passsedVal: string) {
    alert(passsedVal);
  }

  /**
   * Hämtar det senaste datumet från en lista av träningstillfällen.
   * Används för att visa när en övning senast utfördes.
   * @param {any[]} occasions - En array av träningstillfällen, där varje objekt förväntas ha en `date`-egenskap.
   * @returns {string} En datumsträng för det senaste tillfället, eller en tom sträng om listan är tom.
   */
  getLatestOccation(occasions: any): string {
    if (!occasions || occasions.length === 0) {
      return ''; // Returnera tom sträng istället för text, så att | date pipen inte kraschar
    }

    // Använd reduce för att hitta Hela tillfälle-objektet med det senaste datumet
    const latestOccasion = occasions.reduce((latest: any, current: any) => {
        // Skapa Date-objekt för jämförelse
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);

        // Jämför de faktiska Date-objekten och returnera det objekt vars datum är senare.
        if (currentDate > latestDate) {
            return current; // Returnera Hela 'current' objektet
        } else {
            return latest; // Returnera Hela 'latest' objektet
        }
    });

    // Returnera datumsträngen från det senaste tillfälle-objektet
    return latestOccasion.date;
  }
}