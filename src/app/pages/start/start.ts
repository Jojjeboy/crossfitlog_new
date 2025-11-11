import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';



@Component({
    selector: 'app-start',
    standalone: true,
    imports: [CommonModule, ButtonModule, MenuModule],
    templateUrl: 'start.html'
})
export class Start implements OnInit {
    doneWorkouts:any;
    ngOnInit(): void {
        this.doneWorkouts = [];
    }

    

}
