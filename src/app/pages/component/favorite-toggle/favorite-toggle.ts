import { ExerciseService } from '@/pages/service/exercise.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-favorite-toggle',
  imports: [],
  templateUrl: './favorite-toggle.html',
  styleUrl: './favorite-toggle.scss'
})
export class FavoriteToggle {

  @Input() exerciseId: string | undefined;


  constructor(private exerciseService: ExerciseService) {
  }

  isFavourite(exerciseId: string | undefined): boolean {
    if (exerciseId !== undefined) {
      return this.exerciseService.isExerciseInFavorites(exerciseId);
    }
    return false

  }

  toggleFavourite(exerciseId: string | undefined){
    if(exerciseId !== undefined){
      this.exerciseService.toggleFavourite(exerciseId);
    }
  } 
}
