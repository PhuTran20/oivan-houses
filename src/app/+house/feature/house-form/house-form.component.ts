import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { formatPriceRegex, parsePriceRegex } from '../../../shared/data-access/const/price-regex.const';

@Component({
  selector: 'oivan-house-form',
  standalone: true,
  imports: [CommonModule, NzInputModule, NzButtonModule, NzFormModule, ReactiveFormsModule, NzSelectModule, NzInputNumberModule, NzMessageModule],
  templateUrl: './house-form.component.html',
  styleUrl: './house-form.component.scss'
})
export class HouseFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() houseForm!: FormGroup;
  @Input() houseTypes: string[] = [];
  @Input() houseModels: string[] = [];

  formatPrice = (value: number): string => `${value}`.replace(formatPriceRegex, ',');

  parsePrice = (value: string): string => value.replace(parsePriceRegex, '');
}