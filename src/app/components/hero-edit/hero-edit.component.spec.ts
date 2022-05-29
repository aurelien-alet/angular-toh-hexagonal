import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import IDisplayHeroDetail from 'src/app/domain/ports/i-display-hero-detail';

import { HeroEditComponent } from './hero-edit.component';

describe('HeroEditComponent', () => {
  let component: HeroEditComponent;
  let fixture: ComponentFixture<HeroEditComponent>;
  let spyIDisplayHeroDetail: jasmine.SpyObj<IDisplayHeroDetail>;

  beforeEach(async () => {
    spyIDisplayHeroDetail = jasmine.createSpyObj(
      'IDisplayHeroDetail', 
      ['askHeroDetail', 'askHeroNameChange'],
      {hero: {name: 'A', id: 1}}
    );
    spyIDisplayHeroDetail.askHeroDetail.and.returnValue(of());
    spyIDisplayHeroDetail.askHeroNameChange.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [ HeroEditComponent ],
      providers: [
        { provide: 'IDisplayHeroDetail', useValue: spyIDisplayHeroDetail }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroEditComponent);
    component = fixture.componentInstance;
    component.heroId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask hero details once', () =>{
    expect(spyIDisplayHeroDetail.askHeroDetail).toHaveBeenCalledOnceWith(1);
  });

  it('should trigger leaveEdit event on back button click', waitForAsync(() => {
    spyOn(component.leaveEdit, 'emit');
    let button = fixture.debugElement.nativeElement.querySelector('#admin-back');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.leaveEdit.emit).toHaveBeenCalledOnceWith();
    });
  }));

  it('should ask hero name change and leaveEdit event on save button click', waitForAsync(() => {
    spyOn(component.leaveEdit, 'emit');
    let input = fixture.debugElement.nativeElement.querySelector('#edit-hero-name');
    input.value = 'new_name';
    input.dispatchEvent(new Event('input'));

    let button = fixture.debugElement.nativeElement.querySelector('#admin-save');
    button.click();
    
    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroDetail.askHeroNameChange).toHaveBeenCalledOnceWith('new_name');
      expect(component.leaveEdit.emit).toHaveBeenCalledOnceWith();
    });
  }));
});
