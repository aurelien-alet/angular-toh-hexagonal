import { of, throwError } from 'rxjs';
import ErrorsHandler from './errors-handler';
import { HeroOperationError } from './errors/hero-operation-error';

import HeroDetailDisplayer from './hero-detail-displayer';
import IManageHeroes from './ports/i-manage-heroes';
import IManageMessages from './ports/i-manage-messages';

describe('HeroDetailDisplayer', () => {
  let heroDetailDisplayer: HeroDetailDisplayer;
  let errorsHandler: ErrorsHandler;
  let iManageHeroesSpy: jasmine.SpyObj<IManageHeroes>;
  let iManageMessagesSpy: jasmine.SpyObj<IManageMessages>;
  
  beforeEach(() => {
    iManageHeroesSpy = jasmine.createSpyObj('IManageHeroes', ['getHero', 'updateHero']);
    iManageMessagesSpy = jasmine.createSpyObj('IManageMessages', ['add']);
    errorsHandler = new ErrorsHandler(iManageMessagesSpy)
    heroDetailDisplayer = new HeroDetailDisplayer(errorsHandler, iManageHeroesSpy, iManageMessagesSpy);
  });

  it('should get hero detail', (done: DoneFn) => {
    let expectedHero = { id: 1, name: 'A' };
    iManageHeroesSpy.getHero.and.returnValue(of(expectedHero));

    heroDetailDisplayer.askHeroDetail(expectedHero.id).subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroDetailDisplayer.hero).toEqual(expectedHero);
    expect(iManageHeroesSpy.getHero).toHaveBeenCalledOnceWith(expectedHero.id);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(`fethed hero id=${expectedHero.id}`);
  });

  it('should display an error getting hero detail', (done: DoneFn) => {
    let expectedHero = { id: 1, name: 'A' };
    const heroOperationErrorResponse = new HeroOperationError(
      "Hero '1' not found"
    );
    iManageHeroesSpy.getHero.and.returnValue(throwError(() => heroOperationErrorResponse));

    heroDetailDisplayer.askHeroDetail(expectedHero.id).subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroDetailDisplayer.hero).toEqual(undefined);
    expect(iManageHeroesSpy.getHero).toHaveBeenCalledOnceWith(expectedHero.id);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      `getHero id=1 failed. HeroOperationError: Hero '${expectedHero.id}' not found`
    );
  });

  it('should change hero name', (done: DoneFn) => {
    let currentHero = { id: 1, name: 'A' };
    heroDetailDisplayer.hero = currentHero;
    let expectedChangedHero = { id: 1, name: 'B' };
    iManageHeroesSpy.updateHero.and.returnValue(of(expectedChangedHero));
  
    heroDetailDisplayer.askHeroNameChange(expectedChangedHero.name).subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroDetailDisplayer.hero).toEqual(expectedChangedHero);
    expect(iManageHeroesSpy.updateHero).toHaveBeenCalledOnceWith(expectedChangedHero);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(`updated hero id=${currentHero.id}`);
  });

  it('should not change hero name as hero is undefined', (done: DoneFn) => {
    heroDetailDisplayer.askHeroNameChange('B').subscribe({
      next: _ => done.fail('expected an error, not changed hero'),
      error: error  => {
        expect(error.name).toEqual('Error');
        expect(error.message).toContain('No hero selected!');
        done();
      }
    });
  });

  it('should display an error changing hero name', (done: DoneFn) => {
    let currentHero = { id: 1, name: 'A' };
    heroDetailDisplayer.hero = currentHero;
    const heroOperationErrorResponse = new HeroOperationError(
      "Hero '1' not found"
    );
    iManageHeroesSpy.updateHero.and.returnValue(throwError(() => heroOperationErrorResponse));
    let expectedChangedHero = { id: 1, name: 'B' };

    heroDetailDisplayer.askHeroNameChange(expectedChangedHero.name).subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroDetailDisplayer.hero).toEqual(currentHero);
    expect(iManageHeroesSpy.updateHero).toHaveBeenCalledOnceWith(expectedChangedHero);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      `updateHero id=1 failed. HeroOperationError: Hero '${expectedChangedHero.id}' not found`
    );
  });
});
