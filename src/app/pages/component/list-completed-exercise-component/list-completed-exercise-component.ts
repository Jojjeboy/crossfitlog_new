import { CompletedExerciseModel } from '@/pages/models/completedExercise.model';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { List } from '../List';


@Component({
  selector: 'app-list-completed-exercise-component',
  imports: [CommonModule, Dialog],
  templateUrl: './list-completed-exercise-component.html',
  styleUrl: './list-completed-exercise-component.scss'
})
export class ListCompletedExerciseComponent extends List {

  visible: boolean = false;
  @Input() completedExercises?: CompletedExerciseModel[] | null;

  
  showDialog(completedExercise: CompletedExerciseModel) {
      this.visible = true;
  }

  showPopup(passsedVal: string) {
    alert(passsedVal);
  }
}
