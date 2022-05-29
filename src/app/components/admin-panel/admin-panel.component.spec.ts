import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminPanelComponent } from './admin-panel.component';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let spyIDisplayHeroes: jasmine.SpyObj<IDisplayHeroes>;
  let displayedHeroes = [{id: 0, name: 'hero'}];

  beforeEach(async () => {
    spyIDisplayHeroes = jasmine.createSpyObj(
      'IDisplayHeroes', 
      ['askHeroesList', 'askHeroCreation', 'askHeroDeletion', 'askHeroesFiltered'], 
      {heroes: displayedHeroes}
    );
    spyIDisplayHeroes.askHeroesList.and.returnValue(of());
    spyIDisplayHeroes.askHeroCreation.and.returnValue(of());
    spyIDisplayHeroes.askHeroDeletion.and.returnValue(of());
    spyIDisplayHeroes.askHeroesFiltered.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [ AdminPanelComponent ],
      providers: [
        { provide: 'IDisplayHeroes', useValue: spyIDisplayHeroes }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask heroes list', () => {
    expect(spyIDisplayHeroes.askHeroesList).toHaveBeenCalledOnceWith();
  });

  it('should ask hero creation', waitForAsync(() => {
    let input = fixture.debugElement.nativeElement.querySelector('#admin-new-hero');
    input.value = 'new_hero';
    input.dispatchEvent(new Event('input'));

    let button = fixture.debugElement.nativeElement.querySelector('.add');
    button.click();
    
    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroes.askHeroCreation).toHaveBeenCalledOnceWith('new_hero');
    });
  }));

  it('should ask hero deletion', waitForAsync(() => {
    let delButton = fixture.debugElement.nativeElement.querySelector('.delete');
    delButton.click();

    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroes.askHeroDeletion).toHaveBeenCalledOnceWith({id: 0, name: 'hero'});
    });
}));

it('should ask hero edition', waitForAsync(() => {
    let editButton = fixture.debugElement.nativeElement.querySelector('.edit');
    editButton.click();
    
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.selectedHero).toEqual({id: 0, name: 'hero'});
      expect(fixture.debugElement.nativeElement.querySelector('.edited-hero')).toBeTruthy();
    });
  }));

  it('should reload heroes on leaveEdit event', waitForAsync(() => {
    component.selectedHero = displayedHeroes[0];
    fixture.detectChanges();
    let editedHero = fixture.debugElement.nativeElement.querySelector('.edited-hero');
    editedHero.dispatchEvent(new Event('leaveEdit'));

    fixture.whenStable().then(() => {
      expect(component.selectedHero).toEqual(null);
      // called on component create, then called on event
      expect(spyIDisplayHeroes.askHeroesList).toHaveBeenCalledTimes(2);
    });

  }));

  it('should filter heroes', waitForAsync(() => {
    let input = fixture.debugElement.nativeElement.querySelector('#filter-box');
    input.value = 'search_string';
    input.dispatchEvent(new Event('input'));
    
    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroes.askHeroesFiltered).toHaveBeenCalledOnceWith('search_string', true);
    });
  }));
});
