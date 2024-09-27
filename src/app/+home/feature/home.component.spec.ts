import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureComponent } from './home.component';
import { HousesService } from '../../+house/data-access/api/houses.service';
import { AuthService } from '../../+auth/data-access/api/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HouseModelsComponent } from '../../+house/feature/house-models/house-models.component';
import { HousesComponent } from '../../+house/feature/houses/houses.component';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let housesServiceSpy: jasmine.SpyObj<HousesService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const housesServiceSpyObj = jasmine.createSpyObj('HousesService', ['GetAllHouses']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FeatureComponent,
        NzTableModule,
        NzDividerModule,
        NzMenuModule,
        NzSelectModule,
        NzButtonModule,
        FormsModule,
        HttpClientTestingModule,
        HouseModelsComponent,
        HousesComponent
      ],
      providers: [
        { provide: HousesService, useValue: housesServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    housesServiceSpy = TestBed.inject(HousesService) as jasmine.SpyObj<HousesService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter listPriceMax when onMinPriceChange is called', () => {
    component.originalPriceMax = [300000, 200000, 100000];
    component.onMinPriceChange(150000);
    expect(component.listPriceMax).toEqual([300000, 200000]);

    component.onMinPriceChange(0);
    expect(component.listPriceMax).toEqual([300000, 200000, 100000]);
  });

  it('should navigate to create house page when createHouse is called', () => {
    component.createHouse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/house/create']);
  });

  it('should return login status when isLogin is called', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    expect(component.isLogin()).toBeTrue();

    authServiceSpy.isLoggedIn.and.returnValue(false);
    expect(component.isLogin()).toBeFalse();
  });
});