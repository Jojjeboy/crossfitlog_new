import { ExerciseModel } from '@/pages/models/exercise.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../List';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-list-exercise-component',
  imports: [CommonModule, Dialog],
  templateUrl: './list-exercise-component.html',
  styleUrl: './list-exercise-component.scss'
})
export class ListExerciseComponent extends List{

  @Input() exercises?: ExerciseModel[];
  visible: boolean = false;
  
  
  showDialog(exercise: ExerciseModel) {
      this.visible = true;
  }



  

  showPopup(passsedVal: string) {
    alert(passsedVal);
  }



}
