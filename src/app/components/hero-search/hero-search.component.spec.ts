import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';

import { HeroSearchComponent } from './hero-search.component';

describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;
  let spyIDisplayHeroes: jasmine.SpyObj<IDisplayHeroes>;

  beforeEach(async () => {
    spyIDisplayHeroes = jasmine.createSpyObj('IDisplayHeroesSearch', ['askHeroesFiltered'], {heroes: []});
    spyIDisplayHeroes.askHeroesFiltered.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [ HeroSearchComponent ],
      providers: [{ provide: 'IDisplayHeroesSearch', useValue: spyIDisplayHeroes }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask heroes search on input', waitForAsync(() => {
    let input = fixture.debugElement.nativeElement.querySelector('#search-box');
    input.value = 'search_string';
    input.dispatchEvent(new Event('input'));
    
    fixture.whenStable().then(() => {
      expect(spyIDisplayHeroes.askHeroesFiltered).toHaveBeenCalledOnceWith('search_string');
    });
  }));
});
