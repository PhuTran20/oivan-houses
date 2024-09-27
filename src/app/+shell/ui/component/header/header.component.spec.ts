import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../+auth/data-access/api/auth.service';
import { LocalStorage } from '../../../../shared/data-access/store';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.SpyObj<LocalStorage>;

  beforeEach(async () => {
    // Mock AuthService, LocalStorage, and Router
    authServiceSpy = jasmine.createSpyObj('AuthService', ['AuthLogin', 'createLoginRequest', 'isLoggedIn', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorageSpy = jasmine.createSpyObj('LocalStorage', ['set']);

    // Mock implementations for the service methods
    authServiceSpy.AuthLogin.and.returnValue(of({ data: { type: 'auth', attributes: { token: 'fake-token' } } }));
    authServiceSpy.isLoggedIn.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent, // Since HeaderComponent is standalone, import it directly
        ReactiveFormsModule,
        RouterTestingModule,
        NzModalModule,
        NzButtonModule,
        NzIconModule,
        NzInputModule,
        NzFormModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LocalStorage, useValue: localStorageSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form on init', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should not log in if form is invalid', () => {
    // Make form invalid by leaving the controls empty
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');

    // Trigger the login function
    component.onLogin();

    // Expect that the AuthLogin method is not called since the form is invalid
    expect(authServiceSpy.AuthLogin).not.toHaveBeenCalled();
  });

  it('should log in successfully if form is valid', () => {
    // Set valid values
    component.loginForm.controls['username'].setValue('validUser');
    component.loginForm.controls['password'].setValue('validPassword123');

    // Trigger the login function
    component.onLogin();

    // Expect AuthLogin to be called
    expect(authServiceSpy.AuthLogin).toHaveBeenCalled();
    expect(localStorageSpy.set).toHaveBeenCalledWith('authToken', 'fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error message on login failure', () => {
    // Mock AuthLogin to return an error
    authServiceSpy.AuthLogin.and.returnValue(throwError({
      errors: [{ status: 401, detail: 'Unauthorized' }]
    }));

    // Set valid values
    component.loginForm.controls['username'].setValue('invalidUser');
    component.loginForm.controls['password'].setValue('invalidPassword123');

    // Trigger the login function
    component.onLogin();

    expect(authServiceSpy.AuthLogin).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Unauthorized');
  });

  it('should clear error message when form values change', () => {
    component.errorMessage = 'Some error message';
    
    // Change form values
    component.loginForm.controls['username'].setValue('newUser');
    
    expect(component.errorMessage).toBe('');
  });

  it('should log out successfully', () => {
    component.onLogout();
    
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.loading$.value).toBe(false);
  });

  it('should return true if user is logged in', () => {
    expect(component.isLogin()).toBeTrue();
  });
});