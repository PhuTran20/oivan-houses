import { Component } from '@angular/core';
import { HouseLayoutComponent } from '../house-layout/house-layout.component';

@Component({
  selector: 'oivan-house-edit',
  standalone: true,
  imports: [HouseLayoutComponent],
  templateUrl: './house-edit.component.html',
  styleUrl: './house-edit.component.scss'
})
export class HouseEditComponent {
}