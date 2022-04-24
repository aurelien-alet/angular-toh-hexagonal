import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import IDisplayHeroes from 'src/app/domain/ports/i-display-heroes';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let spyIDisplayHeroes: jasmine.SpyObj<IDisplayHeroes>;
  
  beforeEach(async () => {
    spyIDisplayHeroes = jasmine.createSpyObj('IDisplayHeroes', ['askHeroesList'], {heroes: []});
    spyIDisplayHeroes.askHeroesList.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      providers: [{ provide: 'IDisplayHeroes', useValue: spyIDisplayHeroes }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ask heroes list', () => {
    expect(spyIDisplayHeroes.askHeroesList).toHaveBeenCalledOnceWith();
  });
});
