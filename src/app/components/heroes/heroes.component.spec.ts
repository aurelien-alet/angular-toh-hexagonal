import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

import { HeroesComponent } from './heroes.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let spyIDisplayHeroes: jasmine.SpyObj<IDisplayHeroes>;

  beforeEach(async () => {
    spyIDisplayHeroes = jasmine.createSpyObj(
      'IDisplayHeroes', 
      ['askHeroesList', 'askHeroCreation', 'askHeroDeletion'], 
      {heroes: [{id: 0, name: 'hero'}]}
    );
    spyIDisplayHeroes.askHeroesList.and.returnValue(of());
    spyIDisplayHeroes.askHeroCreation.and.returnValue(of());
    spyIDisplayHeroes.askHeroDeletion.and.returnValue(of());
    
    await TestBed.configureTestingModule({
      declarations: [ HeroesComponent ],
      providers: [{ provide: 'IDisplayHeroes', useValue: spyIDisplayHeroes }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
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
    let input = fixture.debugElement.nativeElement.querySelector('#new-hero');
    input.value = 'new_hero';
    input.dispatchEvent(new Event('input'));

    let button = fixture.debugElement.nativeElement.querySelector('.add-button');
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
});
