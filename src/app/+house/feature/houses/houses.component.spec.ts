import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HousesComponent } from './houses.component';
import { HousesService } from './../../data-access/api/houses.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { By } from '@angular/platform-browser';

describe('HousesComponent', () => {
  let component: HousesComponent;
  let fixture: ComponentFixture<HousesComponent>;
  let housesServiceSpy: jasmine.SpyObj<HousesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock HousesService and Router
    housesServiceSpy = jasmine.createSpyObj('HousesService', ['GetAllHouses']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the service's GetAllHouses method to return an observable
    housesServiceSpy.GetAllHouses.and.returnValue(of({
      data: [
        { id: '1', type: 'house', attributes: { model: 'Model A', block_number: 'Block 1', land_number: 'Land 1', price: 100, house_number: 'H1', house_type: 'Type A', status: 'Available' } },
        { id: '2', type: 'house', attributes: { model: 'Model B', block_number: 'Block 2', land_number: 'Land 2', price: 200, house_number: 'H2', house_type: 'Type B', status: 'Sold' } }
      ]
    }));

    await TestBed.configureTestingModule({
      imports: [
        HousesComponent, // Import the standalone component directly
        NzMenuModule,
        NzTableModule,
        NzDividerModule,
      ],
      providers: [
        { provide: HousesService, useValue: housesServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get houses on init', () => {
    component.ngOnInit();
    expect(housesServiceSpy.GetAllHouses).toHaveBeenCalled();
    component.listHouses$.subscribe(houses => {
      expect(houses.length).toBe(2);
      expect(houses[0].attributes.model).toBe('Model A');
    });
  });

  it('should call handleGetHouses when input properties change', () => {
    spyOn(component, 'handleGetHouses').and.callThrough();
    component.model = 'Model A';
    component.ngOnChanges({ model: {
        previousValue: undefined,
        currentValue: undefined,
        firstChange: false,
        isFirstChange: function (): boolean {
            throw new Error('Function not implemented.');
        }
    } });
    expect(component.handleGetHouses).toHaveBeenCalled();
  });

  it('should filter houses based on input properties', () => {
    component.model = 'Model A';
    component.blockNumber = 'Block 1';
    component.landNumber = 'Land 1';
    component.minPrice = 50;
    component.maxPrice = 150;

    component.handleGetHouses();
    component.listHouses$.subscribe(houses => {
      expect(houses.length).toBe(1);
      expect(houses[0].attributes.model).toBe('Model A');
    });
  });

  it('should navigate to edit house', () => {
    const houseId = '123';
    component.editHouse(houseId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/house/edit'], { queryParams: { id: houseId } });
  });
});