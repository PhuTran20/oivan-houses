import { Component, OnInit } from '@angular/core';
import { HousesComponent } from '../../+house/feature/houses/houses.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { HouseModelsComponent } from '../../+house/feature/house-models/house-models.component';
import { HousesService } from '../../+house/data-access/api/houses.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';
import { AuthService } from '../../+auth/data-access/api/auth.service';

@Component({
  selector: 'oivan-home',
  standalone: true,
  imports: [
    HousesComponent,
    NzTableModule,
    NzDividerModule,
    CommonModule,
    NzMenuModule,
    NzSelectModule,
    FormsModule,
    HouseModelsComponent,
    NzButtonModule,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class FeatureComponent implements OnInit {
  selectedBlockNumber: string = '';
  selectedLandNumber: string = '';
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 0;
  listBlockNumber: string[] = [];
  listLandNumber: string[] = [];
  listPriceMin: number[] = [];
  listPriceMax: number[] = [];
  originalPriceMax: number[] = [];
  originalPriceMin: number[] = [];
  readonly dataSet: ReadonlyArray<{ name: string; age: number; address: string }> = [

    { name: "John Doe", age: 30, address: "123 Main St" },
  
    { name: "Jane Doe", age: 25, address: "456 Maple Ave" }
  
  ];
  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false
  };
  
  constructor(private housesService: HousesService, private authService: AuthService, private readonly router: Router) { }

  ngOnInit(): void {
    this.handleGetHouseFilter();
  }

  handleGetHouseFilter(): void {
    this.housesService.GetAllHouses().subscribe((res) => {
      const blockNumber = res.data.map(item => item.attributes.block_number);
      const landNumber = res.data.map(item => item.attributes.land_number);
      const price = res.data.map(item => item.attributes.price);
      this.listBlockNumber = [...new Set(blockNumber)];
      this.listLandNumber = [...new Set(landNumber)];
      this.listPriceMin = [...new Set(price)].sort((a, b) => a - b);
      this.listPriceMax = [...new Set(price)].sort((a, b) => b - a);
      this.originalPriceMax = [...this.listPriceMax];
      this.originalPriceMin = [...this.listPriceMin];
    });
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  onMaxPriceChange(value: number): void {
    if (value !== null) {
      this.listPriceMin = this.originalPriceMin.filter(price => price <= value);
    } else {
      this.listPriceMin = [...this.originalPriceMin];
    }
  }

  onMinPriceChange(value: number): void {
    if (value !== null) {
      this.listPriceMax = this.originalPriceMax.filter(price => price >= value);
    } else {
      this.listPriceMax = [...this.originalPriceMax];
    }
  }

  createHouse(): void {
    this.router.navigate(['/house/create']);
  }

  isLogin(): boolean {
    return this.authService.isLoggedIn();
 }
}
