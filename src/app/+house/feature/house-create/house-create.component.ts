import { Component } from '@angular/core';
import { HouseLayoutComponent } from '../house-layout/house-layout.component';

@Component({
  selector: 'oivan-house-create',
  standalone: true,
  imports: [HouseLayoutComponent],
  templateUrl: './house-create.component.html',
  styleUrl: './house-create.component.scss'
})
export class HouseCreateComponent {
}