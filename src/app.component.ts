import { OnInit, Component } from '@angular/core';
import { ExcerciseModel } from '@/pages/models/excercise.model';
import { Observable } from 'rxjs';
import { ExcerciseService } from '@/pages/service/excercise.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './app.components.html'
})
export class AppComponent implements OnInit {
    
    excercises$: Observable<ExcerciseModel[]>; // Deklarera en observable

    constructor(private excerciseService: ExcerciseService){
        // Tilldela Observable i konstruktorn
        this.excercises$ = this.excerciseService.excercises$; 
    }

    ngOnInit(): void {
        if (!this.excerciseService.getIsLoaded()) {
            this.excerciseService.loadDataFromDB();
        }
    }
}
// Och sedan använder du | async pipen i din template:
// <div *ngFor="let exercise of excercises$ | async">...</div>

//Detta är det rekommenderade sättet att hantera asynkron data i Angular! Låt mig veta om du vill att jag fixar din `AppComponent` så att den också använder `Observable`s korrekt.