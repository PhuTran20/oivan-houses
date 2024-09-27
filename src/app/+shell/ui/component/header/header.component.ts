import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../+auth/data-access/api/auth.service';
import { LocalStorage } from '../../../../shared/data-access/store';
import { LoginModel } from '../../../../+auth/data-access/model/login.model';
import { ResponseError, ResponseObjectResult } from '../../../../shared/data-access/interface/response.type';
import { BehaviorSubject } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';


@Component({
  selector: 'oivan-header',
  standalone: true,
  imports: [
    NzFormModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTabsModule,
    ReactiveFormsModule,
    CommonModule,
    NzModalModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  errorMessage: string | null = null;
  loginForm: FormGroup;
  isVisible = signal(false);
  loading$ = new BehaviorSubject<boolean>(false);
  showLoginModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorage: LocalStorage,
    private route: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading$.next(true);
    const loginData = this.loginForm.value;
    this.authService.AuthLogin(
      this.authService.createLoginRequest(loginData)
    ).subscribe({
      next: (res: ResponseObjectResult<LoginModel.Response>) => {
        this.handleLoginSuccess(res);
        this.loading$.next(false);
        this.showLoginModal = false;
      },
      error: (res: ResponseError<any>) => {
        this.handleLoginError(res);
        this.loading$.next(false);
      },
    })
  }

  handleLoginSuccess(response: ResponseObjectResult<LoginModel.Response>) {
    const { token } = response.data.attributes;
    if (token) {
      this.localStorage.set('authToken', token);
      this.route.navigate(['/home']);
    }
   }

   handleLoginError(response: ResponseError<any>) {
    const { status } = response.errors[0];
    if (status && [400, 401].includes(Number(status))) {
      this.errorMessage = response.errors[0].detail;
    }
   }

   isLogin() {
      return this.authService.isLoggedIn();
   }

    onLogout() {
      this.loading$.next(true);
      this.authService.logout();
      this.loading$.next(false);
      this.route.navigate(['/']);
    }
}