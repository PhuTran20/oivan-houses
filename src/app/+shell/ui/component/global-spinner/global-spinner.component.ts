import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GlobalSpinnerStore } from './global-spinner.store';

@Component({
  selector: 'oivan-spinner',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSpinnerService implements OnInit {
  gsStore = inject(GlobalSpinnerStore);

  isLoading = signal(0);

  @ViewChild('spinnerContainer', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.disableKeyboardWhenLoading();
  }

  disableKeyboardWhenLoading() {
    effect(() => {
      if (this.isLoading() > 0) {
        const handler = (event: KeyboardEvent) => {
          event.preventDefault();
        };
        if(isPlatformBrowser(this.platformId))
            window.addEventListener('keydown', handler);
      } else {
        const handler = (event: KeyboardEvent) => {
          event.preventDefault();
        };
        if(isPlatformBrowser(this.platformId))
            window.removeEventListener('keydown', handler);
      }
    });
  }

  setLoading() {
    this.isLoading.update((value) => value + 1);
  }
  stopLoading() {
    this.isLoading.update((value) => value - 1);
  }

  ngOnInit() {
  }
}
