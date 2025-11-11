import { DataService } from '@/pages/service/data-service';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './app.components.html'
})
export class AppComponent implements OnInit {


    constructor(private dataService: DataService){}

    ngOnInit(): void {
        if (!this.dataService.getIsLoaded()) {
            this.dataService.loadData().subscribe(data => {
                this.dataService.setData(data);
            });
        }
    }
}
