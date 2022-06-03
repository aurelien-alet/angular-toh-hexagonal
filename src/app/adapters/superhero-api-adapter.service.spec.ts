import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Hero } from '../domain/models/hero';

import { SuperheroApiAdapterService } from './superhero-api-adapter.service';
import { heroesFixture } from './superhero-api-adapter.service.spec.fixture';

describe('SuperheroApiAdapterService', () => {
  let service: SuperheroApiAdapterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }]
    });
    service = TestBed.inject(SuperheroApiAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected heroes', (done: DoneFn) => {
    const expectedHeroes: Hero[] =
      [{ id: 1, name: 'A-Bomb' }, { id: 2, name: 'Abe Sapien' }];

    httpClientSpy.get.and.returnValue(of(heroesFixture));

    service.getHeroes().subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://akabab.github.io/superhero-api/api/all.json');
  });

  it('should return an error getting heroes when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      message: 'test 404 error'
    };

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));
  
    service.getHeroes().subscribe({
      next: _ => done.fail('expected an error, not heroes'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });

  it('should return expected hero details', (done: DoneFn) => {
    const expectedHero: Hero = { id: 1, name: 'A-Bomb' };

    httpClientSpy.get.and.returnValue(of(heroesFixture[0]));

    service.getHero(1).subscribe({
        next: hero => {
          expect(hero).toEqual(expectedHero);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://akabab.github.io/superhero-api/api/id/1.json');
  });

  it('should return an error getting hero details when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      message: 'test 404 error',
    };

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));
  
    service.getHero(1).subscribe({
      next: _ => done.fail('expected an error, not hero details'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });

  it('should return searched heroes', (done: DoneFn) => {
    const expectedHeroes: Hero[] =
      [{ id: 1, name: 'A-Bomb' }];

    httpClientSpy.get.and.returnValue(of(heroesFixture));

    service.searchHeroes("a-").subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://akabab.github.io/superhero-api/api/all.json');
  });

  it('empty search shoul return all heroes', (done: DoneFn) => {
    const expectedHeroes: Hero[] =
      [{ id: 1, name: 'A-Bomb' }, { id: 2, name: 'Abe Sapien' }];

    httpClientSpy.get.and.returnValue(of(heroesFixture));

    service.searchHeroes("").subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://akabab.github.io/superhero-api/api/all.json');
  });

  it('should not match any heroes', (done: DoneFn) => {
    const expectedHeroes: Hero[] = [];

    httpClientSpy.get.and.returnValue(of(heroesFixture));

    service.searchHeroes("rggjeie").subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://akabab.github.io/superhero-api/api/all.json');
  });

  it('should return an error searching heroes when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      message: 'test 404 error'
    };

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse));
  
    service.searchHeroes("A").subscribe({
      next: _ => done.fail('expected an error, not heroes'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });

  it('new hero creation should raise an error', (done: DoneFn) => {
    const newHero: Hero = { id: 1, name: 'A' };

    service.addHero(newHero).subscribe({
      next: _ => done.fail('expected an error'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('Add not handled by this API');
        done();
      }
    });
  });

  it('should put hero new values', (done: DoneFn) => {
    const modifiedHero: Hero = { id: 1, name: 'A' };

    service.updateHero(modifiedHero).subscribe({
      next: _ => done.fail('expected an error'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('Update not handled by this API');
        done();
      }
    });
  });

  it('should delete expected hero', (done: DoneFn) => {
    const heroId: number = 1;

    service.deleteHero(heroId).subscribe({
      next: _ => done.fail('expected an error'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('Delete not handled by this API');
        done();
      }
    });
  });
});
