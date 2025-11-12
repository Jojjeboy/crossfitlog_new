import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SearchExcerciseComponent } from '../component/search-excercise-component/search-excercise-component';



@Component({
    selector: 'app-start',
    standalone: true,
    imports: [
        CommonModule, 
        ButtonModule, 
        MenuModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        IftaLabelModule, 
        InputNumberModule, 
        SelectModule, 
        FloatLabelModule, 
        InputTextModule,
        SearchExcerciseComponent],
    templateUrl: 'start.html',
    styleUrl: 'start.scss'

})
export class Start implements OnInit { 
    doneWorkouts:any;
    value: number = 10;
    ngOnInit(): void {
        this.doneWorkouts = [];
    }

    

}
