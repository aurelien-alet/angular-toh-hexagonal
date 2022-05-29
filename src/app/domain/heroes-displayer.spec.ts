import { of, throwError } from 'rxjs';
import ErrorsHandler from './errors-handler';
import { HeroOperationError } from './errors/hero-operation-error';

import { Hero } from "./models/hero";
import HeroesDisplayer from './heroes-displayer';
import IManageHeroes from './ports/i-manage-heroes';
import IManageMessages from './ports/i-manage-messages';

describe('HeroesDisplayer', () => {
  let heroesDisplayer: HeroesDisplayer;
  let errorsHandler: ErrorsHandler;
  let iManageHeroesSpy: jasmine.SpyObj<IManageHeroes>;
  let iManageMessagesSpy: jasmine.SpyObj<IManageMessages>;
  
  beforeEach(() => {
    iManageHeroesSpy = jasmine.createSpyObj('IManageHeroes', ['getHeroes', 'searchHeroes', 'addHero', 'deleteHero']);
    iManageMessagesSpy = jasmine.createSpyObj('IManageMessages', ['add']);
    errorsHandler = new ErrorsHandler(iManageMessagesSpy)
    heroesDisplayer = new HeroesDisplayer(errorsHandler, iManageHeroesSpy, iManageMessagesSpy);
  });

  it('should get heroes list', (done: DoneFn) => {
    let expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];
    iManageHeroesSpy.getHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesList().subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.getHeroes).toHaveBeenCalledOnceWith();
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith('fetched heroes');
  });
  
  it('should get heroes list filtered if filter is set', (done: DoneFn) => {
    heroesDisplayer.filter = 'B';
    let expectedHeroes = [
        { id: 2, name: 'B' },
    ];
    iManageHeroesSpy.searchHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesList().subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledOnceWith('B');
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith('found heroes matching "B"');
  });

  it('should display an error getting heroes list', (done: DoneFn) => {
    const heroOperationErrorResponse = new HeroOperationError(
      "Service unavailable"
    );
    iManageHeroesSpy.getHeroes.and.returnValue(throwError(() => heroOperationErrorResponse));

    heroesDisplayer.askHeroesList().subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual([]);
    expect(iManageHeroesSpy.getHeroes).toHaveBeenCalledOnceWith();
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      'getHeroes failed. HeroOperationError: Service unavailable'
    );
  });

  it('should get heroes list filtered by their name', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'AB' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    let expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 3, name: 'AB' },
    ];
    iManageHeroesSpy.searchHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesFiltered('A').subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.filter).toEqual('A');
    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledOnceWith('A');
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith('found heroes matching "A"');
  });

  it('should get empty list on search when pattern does not match', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'AB' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    let expectedHeroes: Hero[] = [];
    iManageHeroesSpy.searchHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesFiltered('C').subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.filter).toEqual('C');
    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledOnceWith('C');
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith('no heroes matching "C"');
  });

  it('should get empty list on search when filter is empty, and empty is not allowed', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'AB' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    let expectedHeroes: Hero[] = [];
    iManageHeroesSpy.searchHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesFiltered('').subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.filter).toEqual('');
    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledTimes(0);
  });

  it('should get all heroes on search when filter is empty, and empty is allowed', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'AB' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    let expectedHeroes = currentHeroes;
    iManageHeroesSpy.searchHeroes.and.returnValue(of(expectedHeroes));

    heroesDisplayer.askHeroesFiltered('', true).subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.filter).toEqual('');
    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledOnceWith('');
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith('found heroes matching ""');
  });

  it('should display an error searching heroes', (done: DoneFn) => {
    const heroOperationErrorResponse = new HeroOperationError(
      "Service unavailable"
    );
    iManageHeroesSpy.searchHeroes.and.returnValue(throwError(() => heroOperationErrorResponse));

    heroesDisplayer.askHeroesFiltered('A').subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroesDisplayer.filter).toEqual('A');
    expect(heroesDisplayer.heroes).toEqual([]);
    expect(iManageHeroesSpy.searchHeroes).toHaveBeenCalledOnceWith('A');
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      'searchHeroes failed. HeroOperationError: Service unavailable'
    );
  });

  it('should add hero', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    let newHero = { id: 3, name: 'C' };
    iManageHeroesSpy.addHero.and.returnValue(of(newHero));
    let expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
    ];

    heroesDisplayer.askHeroCreation('C').subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.addHero).toHaveBeenCalledOnceWith({name: 'C'} as Hero);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(`added hero w/ id=${newHero.id}`);
  });

  it('should add hero and filter it', (done: DoneFn) => {
    let currentHeroes = [
        { id: 2, name: 'B' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    heroesDisplayer.filter = 'B';
    let newHero = { id: 3, name: 'C' };
    iManageHeroesSpy.addHero.and.returnValue(of(newHero));
    let expectedHeroes = currentHeroes;

    heroesDisplayer.askHeroCreation('C').subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.addHero).toHaveBeenCalledOnceWith({name: 'C'} as Hero);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(`added hero w/ id=${newHero.id}`);
  });

  it('should display an error adding hero', (done: DoneFn) => {
    let currentHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];
    heroesDisplayer.heroes = currentHeroes;
    const heroOperationErrorResponse = new HeroOperationError(
      "Service unavailable"
    );
    iManageHeroesSpy.addHero.and.returnValue(throwError(() => heroOperationErrorResponse));

    heroesDisplayer.askHeroCreation('C').subscribe({
      next: _ => {
        done();
      },
      error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(currentHeroes);
    expect(iManageHeroesSpy.addHero).toHaveBeenCalledOnceWith({name: 'C'} as Hero);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      'addHero failed. HeroOperationError: Service unavailable'
    );
  });

  it('should delete hero', (done: DoneFn) => {
    let heroToDelete = { id: 2, name: 'B' };
    let currentHeroes = [
        { id: 1, name: 'A' },
        heroToDelete,
    ];
    heroesDisplayer.heroes = currentHeroes;
    iManageHeroesSpy.deleteHero.and.returnValue(of(2));
    let expectedHeroes = [
        { id: 1, name: 'A' },
    ];

    heroesDisplayer.askHeroDeletion(heroToDelete).subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(expectedHeroes);
    expect(iManageHeroesSpy.deleteHero).toHaveBeenCalledOnceWith(heroToDelete.id);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(`deleted hero id=${heroToDelete.id}`);
  });

  it('should display an error deleting hero', (done: DoneFn) => {
    let heroToDelete = { id: 2, name: 'B' };
    let currentHeroes = [
        { id: 1, name: 'A' },
        heroToDelete,
    ];
    heroesDisplayer.heroes = currentHeroes;
    const heroOperationErrorResponse = new HeroOperationError(
      "Service unavailable"
    );
    iManageHeroesSpy.deleteHero.and.returnValue(throwError(() => heroOperationErrorResponse));

    heroesDisplayer.askHeroDeletion(heroToDelete).subscribe({
        next: _ => {
            done();
        },
        error: done.fail
    });

    expect(heroesDisplayer.heroes).toEqual(currentHeroes);
    expect(iManageHeroesSpy.deleteHero).toHaveBeenCalledOnceWith(heroToDelete.id);
    expect(iManageMessagesSpy.add).toHaveBeenCalledOnceWith(
      'deleteHero failed. HeroOperationError: Service unavailable'
    );
  });
});
