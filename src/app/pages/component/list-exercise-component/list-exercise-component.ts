import { ExerciseModel } from '@/pages/models/exercise.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List } from '../List';

@Component({
  selector: 'app-list-exercise-component',
  imports: [CommonModule],
  templateUrl: './list-exercise-component.html',
  styleUrl: './list-exercise-component.scss'
})
export class ListExerciseComponent extends List{


  @Input() exercises?: ExerciseModel[];




  

  showPopup(passsedVal: string) {
    alert(passsedVal);
  }



}
