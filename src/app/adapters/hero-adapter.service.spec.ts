import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Hero } from '../domain/models/hero';

import { HeroAdapterService } from './hero-adapter.service';

describe('HeroAdapterService', () => {
  let service: HeroAdapterService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }]
    });
    service = TestBed.inject(HeroAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected heroes', (done: DoneFn) => {
    const expectedHeroes: Hero[] =
      [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

    httpClientSpy.get.and.returnValue(of(expectedHeroes));

    service.getHeroes().subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('api/heroes');
  });

  it('should return an error getting heroes when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
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
    const expectedHero: Hero = { id: 1, name: 'A' };

    httpClientSpy.get.and.returnValue(of(expectedHero));

    service.getHero(1).subscribe({
        next: hero => {
          expect(hero).toEqual(expectedHero);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('api/heroes/1');
  });

  it('should return an error getting hero details when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
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
      [{ id: 1, name: 'A' }, { id: 2, name: 'AA' }];

    httpClientSpy.get.and.returnValue(of(expectedHeroes));

    service.searchHeroes("A").subscribe({
        next: heroes => {
          expect(heroes).toEqual(expectedHeroes);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.get).toHaveBeenCalledOnceWith('api/heroes/?name=A');
  });

  it('should return an error searching heroes when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
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

  it('should post new hero creation', (done: DoneFn) => {
    const newHero: Hero = { id: 1, name: 'A' };

    httpClientSpy.post.and.returnValue(of(newHero));

    service.addHero(newHero).subscribe({
        next: hero => {
          expect(hero).toEqual(newHero);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.post).toHaveBeenCalledOnceWith('api/heroes', newHero, service.httpOptions);
  });

  it('should return an error adding hero when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
    };

    const newHero: Hero = { id: 1, name: 'A' };

    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));
  
    service.addHero(newHero).subscribe({
      next: _ => done.fail('expected an error, not new hero'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });

  it('should put hero new values', (done: DoneFn) => {
    const modifiedHero: Hero = { id: 1, name: 'A' };

    httpClientSpy.put.and.returnValue(of(modifiedHero));

    service.updateHero(modifiedHero).subscribe({
        next: hero => {
          expect(hero).toEqual(modifiedHero);
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.put).toHaveBeenCalledOnceWith('api/heroes', modifiedHero, service.httpOptions);
  });

  it('should return an error updating hero when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
    };

    const modifiedHero: Hero = { id: 1, name: 'A' };

    httpClientSpy.put.and.returnValue(throwError(() => errorResponse));
  
    service.updateHero(modifiedHero).subscribe({
      next: _ => done.fail('expected an error, not updated hero'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });

  it('should delete expected hero', (done: DoneFn) => {
    const heroId: number = 1;

    httpClientSpy.delete.and.returnValue(of(heroId));

    service.deleteHero(heroId).subscribe({
        next: _ => {
          done();
        },
        error: done.fail
      });
    expect(httpClientSpy.delete).toHaveBeenCalledOnceWith('api/heroes/1', service.httpOptions);
  });

  it('should return an error deleting when the server returns a 404', (done: DoneFn) => {
  
    const errorResponse = {
      body: { error: 'test 404 error'},
      status: 404, statusText: 'Not Found'
    };

    httpClientSpy.delete.and.returnValue(throwError(() => errorResponse));
  
    service.deleteHero(1).subscribe({
      next: _ => done.fail('expected an error, not deleted hero'),
      error: error  => {
        expect(error.name).toEqual('HeroOperationError');
        expect(error.message).toContain('test 404 error');
        done();
      }
    });
  });
});
