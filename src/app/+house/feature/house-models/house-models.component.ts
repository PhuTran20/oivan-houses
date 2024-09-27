import { HouseModelsService } from './../../data-access/api/house-models.service';
import { map, Observable, filter } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HouseModelsModel } from "../../data-access/model/house-models.model";
import { HousesComponent } from '../houses/houses.component';
@Component({
  selector: 'oivan-house-models',
  standalone: true,
  imports: [CommonModule, NzMenuModule, HousesComponent],
  templateUrl: './house-models.component.html',
  styleUrl: './house-models.component.scss'
})

export class HouseModelsComponent implements OnInit {
  @Input() blockNumber: string = '';
  @Input() landNumber: string = '';
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 0;
  listHouseModels$: Observable<HouseModelsModel.Response[]> = new Observable();
  openMap: { [name: string]: boolean } = {};

  constructor(private houseModelsService: HouseModelsService) { }

  ngOnInit(): void {
    this.handleGetHouseModels();
  }

  initializeOpenMap(models: string[]): void {
    models.forEach(model => {
      this.openMap[model] = false;
    });
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  handleGetHouseModels(): void {
    this.listHouseModels$ = this.houseModelsService.GetAllHouseModels().pipe(
      map((res) => {
        const models = res.data.map(item => item.attributes.model);
        this.initializeOpenMap(models);
        return res.data;
      })
    );
  }
}
