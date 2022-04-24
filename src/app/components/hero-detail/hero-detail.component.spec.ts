import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { of } from 'rxjs';
import IDisplayHeroDetail from 'src/app/domain/ports/i-display-hero-detail';
import { Location } from '@angular/common';

import { HeroDetailComponent } from './hero-detail.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let spyIDisplayHeroDetail: jasmine.SpyObj<IDisplayHeroDetail>;
  let spyLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    spyIDisplayHeroDetail = jasmine.createSpyObj(
      'IDisplayHeroDetail', 
      ['askHeroDetail', 'askHeroNameChange'],
      {hero: {name: '', id: 0}}
    );
    spyIDisplayHeroDetail.askHeroDetail.and.returnValue(of());
    spyIDisplayHeroDetail.askHeroNameChange.and.returnValue(of());

    spyLocation = jasmine.createSpyObj(Location, ['back'])

    await TestBed.configureTestingModule({
      declarations: [ HeroDetailComponent ],
      providers: [
        { provide: 'IDisplayHeroDetail', useValue: spyIDisplayHeroDetail }, 
        { provide: Location, useValue: spyLocation },
        {
          provide: ActivatedRoute,
          useValue:  {snapshot: { paramMap: convertToParamMap({id: 0}) }}
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([{path: 'detail/0', component: HeroDetailComponent}])
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask hero details once', () =>{
    expect(spyIDisplayHeroDetail.askHeroDetail).toHaveBeenCalledOnceWith(0);
  });

  it('should navigate back on go back button click', waitForAsync(() => {
    let button = fixture.debugElement.nativeElement.querySelector('#go-back-button');
    button.click();

    fixture.whenStable().then(() => {
      expect(spyLocation.back).toHaveBeenCalledOnceWith();
    });
  }));

  it('should ask hero name change navigate back on hero name change button click', waitForAsync(() => {
    let input = fixture.debugElement.nativeElement.querySelector('#hero-name');
    input.value = 'new_name';
    input.dispatchEvent(new Event('input'));

    let button = fixture.debugElement.nativeElement.querySelector('#change-name-button');
    button.click();
    
    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroDetail.askHeroNameChange).toHaveBeenCalledOnceWith('new_name');
      expect(spyLocation.back).toHaveBeenCalledOnceWith();
    });
  }));
});
