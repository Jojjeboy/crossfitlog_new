import { CompletedExerciseModel } from '@/pages/models/completedExercise.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { List } from '../List';


@Component({
  selector: 'app-list-completed-exercise-component',
  imports: [CommonModule, Dialog, TabsModule],
  templateUrl: './list-completed-exercise-component.html',
  styleUrl: './list-completed-exercise-component.scss'
})
export class ListCompletedExerciseComponent extends List {

  visible: boolean = false;
  @Input() completedExercises?: CompletedExerciseModel[] | null;
  selectedExcercise?: CompletedExerciseModel;

  
  showDialog(completedExercise: CompletedExerciseModel) {
      this.visible = true;
      this.selectedExcercise = completedExercise;
  }

  showPopup(passsedVal: string) {
    alert(passsedVal);
  }

  getLatestOccation(occasions: any){
    return occasions.reduce((latest:any, current:any) => {
        // Skapa Date-objekt från datumsträngarna för att kunna jämföra dem
        const latestDate = new Date(latest.date);
        const currentDate = new Date(current.date);

        // Om det aktuella datumet är senare (större) än det hittills senaste,
        // returnera det aktuella objektet.
        if (currentDate > latestDate) {
            return current.date;
        } else {
            return latest.date;
        }
    });
  }
}
