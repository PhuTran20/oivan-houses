import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HouseModelsComponent } from './house-models.component';
import { HouseModelsService } from './../../data-access/api/house-models.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HousesComponent } from '../houses/houses.component';
import { HttpClientModule } from '@angular/common/http';  
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import animations module

describe('HouseModelsComponent', () => {
  let component: HouseModelsComponent;
  let fixture: ComponentFixture<HouseModelsComponent>;
  let houseModelsServiceSpy: jasmine.SpyObj<HouseModelsService>;

  beforeEach(async () => {
    // Mock HouseModelsService
    houseModelsServiceSpy = jasmine.createSpyObj('HouseModelsService', ['GetAllHouseModels']);

    // Mock the service's GetAllHouseModels method to return an observable
    houseModelsServiceSpy.GetAllHouseModels.and.returnValue(of({
      data: [
        {
          id: '1',
          type: 'house_models',
          attributes: {
            model: 'Model A',
            media: {
              title: 'Modern House',
              video: 'https://example.com/video1.mp4',
              banner: 'https://example.com/banner1.jpg',
              description: 'A beautiful modern house with spacious interiors.'
            },
            house_type: 'Single Family Home'
          },
          links: {
            self: 'https://example.com/house_models/1'
          }
        },
        {
          id: '2',
          type: 'house_models',
          attributes: {
            model: 'Model B',
            media: {
              title: 'Luxury Villa',
              video: 'https://example.com/video2.mp4',
              banner: 'https://example.com/banner2.jpg',
              description: 'An elegant villa with a stunning view.'
            },
            house_type: 'Villa'
          },
          links: {
            self: 'https://example.com/house_models/2'
          }
        },
        {
          id: '3',
          type: 'house_models',
          attributes: {
            model: 'Model C',
            media: {
              title: 'Cozy Cottage',
              video: 'https://example.com/video3.mp4',
              banner: 'https://example.com/banner3.jpg',
              description: 'A cozy cottage perfect for a weekend getaway.'
            },
            house_type: 'Cottage'
          },
          links: {
            self: 'https://example.com/house_models/3'
          }
        }
      ]
    }));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NzMenuModule,
        HttpClientModule,  
        BrowserAnimationsModule, // Add BrowserAnimationsModule here
        HousesComponent,
        HouseModelsComponent 
      ],
      providers: [
        { provide: HouseModelsService, useValue: houseModelsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get house models on init', () => {
    component.ngOnInit();
    expect(houseModelsServiceSpy.GetAllHouseModels).toHaveBeenCalled();
    component.listHouseModels$.subscribe(models => {
      expect(models.length).toBe(3);
      expect(models[0].attributes.model).toBe('Model A');
    });
  });

  it('should initialize openMap with models', () => {
    const models = ['Model A', 'Model B'];
    component.initializeOpenMap(models);
    expect(component.openMap['Model A']).toBeFalse();
    expect(component.openMap['Model B']).toBeFalse();
  });

  it('should set openMap to false for all except the specified value when openHandler is called', () => {
    component.openMap = {
      'Model A': true,
      'Model B': true,
      'Model C': true
    };

    component.openHandler('Model A');

    expect(component.openMap['Model A']).toBeTrue();
    expect(component.openMap['Model B']).toBeFalse();
    expect(component.openMap['Model C']).toBeFalse();
  });
});