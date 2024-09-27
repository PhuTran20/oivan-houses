import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GlobalSpinnerService } from './+shell/ui/component/global-spinner/global-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, GlobalSpinnerService, RouterOutlet],
  template:`<router-outlet />
    <oivan-spinner />`,
})
export class AppComponent {

  constructor(){}
}