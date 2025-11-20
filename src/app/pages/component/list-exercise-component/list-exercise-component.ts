import { ExerciseModel } from '@/pages/models/exercise.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../List';
import { Dialog } from 'primeng/dialog';
import { TabsModule } from 'primeng/tabs';
import { OccasionFormComponent } from '../occasion-form-component/occasion-form-component';
import { ExcerciseDescription } from "../excercise-description/excercise-description";
import { ExerciseService } from '@/pages/service/exercise.service';
import { FavoriteToggle } from '../favorite-toggle/favorite-toggle';


@Component({
  selector: 'app-list-exercise-component',
  imports: [CommonModule, Dialog, TabsModule, OccasionFormComponent, ExcerciseDescription, FavoriteToggle],
  templateUrl: './list-exercise-component.html',
  styleUrl: './list-exercise-component.scss'
})
export class ListExerciseComponent extends List {


  constructor() {
    super();
  }


  @Input() exercises: ExerciseModel[] = [];
  visible: boolean = false;
  selectedExcercise?: ExerciseModel;


  showDialog(exercise: ExerciseModel) {
    this.visible = true;
    this.selectedExcercise = exercise;
  }


  occasionAdded(newOccasion: any) {
    console.log('Received message from child:', newOccasion);
    this.visible = false;
  }



  showPopup(passsedVal: string) {
    alert(passsedVal);
  }
}
