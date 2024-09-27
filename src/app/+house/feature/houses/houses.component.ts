import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { HousesModel } from '../../data-access/model/houses.model';
import { HousesService } from './../../data-access/api/houses.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../+auth/data-access/api/auth.service';

@Component({
  selector: 'oivan-houses',
  standalone: true,
  imports: [NzMenuModule, NzTableModule, NzDividerModule, CommonModule],
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit, OnChanges {
  @Input() model: string = '';
  @Input() blockNumber: string = '';
  @Input() landNumber: string = '';
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 0;
  listHouses$: Observable<HousesModel.Response[]> = new Observable();
  pageIndex = 1;

  constructor(private housesService: HousesService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.handleGetHouses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] || changes['blockNumber'] || changes['landNumber'] || changes['minPrice'] || changes['maxPrice']) {
      this.handleGetHouses();
    }
  }

  handleGetHouses(): void {
    this.listHouses$ = this.housesService.GetAllHouses().pipe(
      map((res) => 
        res.data.filter(item => {
          let isValid = true;

          if (this.model) {
            isValid = isValid && item.attributes.model === this.model;
          }
          if (this.blockNumber) {
            isValid = isValid && item.attributes.block_number === this.blockNumber;
          }
          if (this.landNumber) {
            isValid = isValid && item.attributes.land_number === this.landNumber;
          }
          if (this.minPrice) {
            isValid = isValid && item.attributes.price >= this.minPrice;
          }
          if (this.maxPrice) {
            isValid = isValid && item.attributes.price <= this.maxPrice;
          }

          return isValid;
        })
      )
    );
  }

  editHouse(id: string): void {
    this.router.navigate(['/house/edit'], { queryParams: { id } });
  }

  isLogin(): boolean {
    return this.authService.isLoggedIn();
  }
}