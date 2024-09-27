import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { HousesService } from '../../data-access/api/houses.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, concatMap, switchMap, tap, catchError, BehaviorSubject, Observable, of } from 'rxjs';
import { HousesModel } from '../../data-access/model/houses.model';
import { HouseFormComponent } from '../house-form/house-form.component';
import { BreadcrumbsComponent } from '../../../shared/ui/component';

@Component({
  selector: 'oivan-house-layout',
  standalone: true,
  imports: [CommonModule, NzInputModule, NzButtonModule, NzFormModule, ReactiveFormsModule, NzSelectModule, NzInputNumberModule, NzMessageModule, HouseFormComponent, BreadcrumbsComponent],
  templateUrl: './house-layout.component.html',
  styleUrl: './house-layout.component.scss'
})
export class HouseLayoutComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  houseForm: FormGroup;
  loading$ = new BehaviorSubject<boolean>(false);
  errorMessage: string | null = null;
  houseTypes: string[] = [];
  houseModels: string[] = [];
  houseNumbers: string[] = [];
  currentHouse: HousesModel.Response = {
    id: '',
    type: '',
    links: {
      self: ''
    },
    attributes: {
      house_number: '',
      price: 0,
      block_number: '',
      land_number: '',
      house_type: '',
      model: '',
      status: ''
    }
  }

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private housesService: HousesService,
    private readonly route: ActivatedRoute
  ) {
    this.houseForm = this.fb.group({
      houseNumber: ['', [Validators.required]],
      blockNumber: ['', [Validators.required]],
      landNumber: ['', [Validators.required]],
      houseType: ['', [Validators.required]],
      houseModel: ['', [Validators.required]],
      price: [1, [Validators.required, Validators.min(1)]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.handleErrorForm();
    this.handleGetHouseFilter().pipe(
      concatMap(() => this.mode === 'edit' ? this.preloadHouseData() : of(null))
    ).subscribe();
  }

  checkHouseNumber(value: string): void {
    if (this.houseNumbers.includes(value) && value !== this.currentHouse?.attributes.house_number) {
      this.houseForm.get('houseNumber')?.setErrors({ usedHouseNumber: true });
    } else {
      this.houseForm.get('houseNumber')?.setErrors(null);
    }
  }

  saveForm() {
    if (this.houseForm.valid) {
      this.loading$.next(true);
      const dataToPersist: HousesModel.Response = {
        type: 'houses',
        attributes: {
          house_number: this.houseForm.value.houseNumber,
          block_number: this.houseForm.value.blockNumber,
          land_number: this.houseForm.value.landNumber,
          model: this.houseForm.value.houseModel,
          house_type: this.houseForm.value.houseType,
          price: this.houseForm.value.price,
          status: this.houseForm.value.status
        }
      };
      if(this.mode === 'edit') {
        dataToPersist.id = this.currentHouse.id;
      }
      const operation$: Observable<any> = this.mode === 'create'
      ? this.housesService.CreateHouse(dataToPersist)
      : this.housesService.EditHouse(dataToPersist);

      operation$.pipe(
        tap(() => {
          this.message.success(`House ${this.mode === 'create' ? 'created' : 'updated'} successfully`);
          this.loading$.next(false);
          if (this.mode === 'create') {
            this.houseForm.reset();
          }
        }),
        catchError((error) => {
          this.message.error(`Failed to ${this.mode} house`);
          this.loading$.next(false);
          throw new Error(error.errors[0].detail);
        })
      ).subscribe();

    } else {
      Object.values(this.houseForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fix the errors in the form');
    }
  }

  handleGetHouseFilter() {
    return this.housesService.GetAllHouses().pipe(
      map((res) => {
        const houseType = res.data.map(item => item.attributes.house_type);
        const houseModel = res.data.map(item => item.attributes.model);
        const houseNumber = res.data.map(item => item.attributes.house_number);

        this.houseTypes = [...new Set(houseType)];
        this.houseModels = [...new Set(houseModel)];
        this.houseNumbers = [...new Set(houseNumber)];
      })
    );
  }

  handleErrorForm(): void {
    this.houseForm.get('houseNumber')?.valueChanges.subscribe(value => {
      this.checkHouseNumber(value);
    });
  }

  preloadHouseData(): Observable<void> {
    return this.route.queryParams.pipe(
      map((params) => params['id']),
      switchMap(id => this.housesService.GetHouseById(id)),
      filter((house) => !!house),
      map((res) => res.data),
      map((house) => {
        this.currentHouse = house;
        this.houseForm.patchValue({
          houseNumber: house.attributes.house_number,
          blockNumber: house.attributes.block_number,
          landNumber: house.attributes.land_number,
          houseType: house.attributes.house_type,
          houseModel: house.attributes.model,
          price: house.attributes.price,
          status: house.attributes.status
        });
      })
    );
  }
}