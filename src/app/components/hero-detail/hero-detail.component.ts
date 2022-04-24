import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import IDisplayHeroDetail from 'src/app/domain/ports/i-display-hero-detail';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {

  constructor(
    @Inject('IDisplayHeroDetail') public heroDetailDisplayer: IDisplayHeroDetail,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroDetailDisplayer.askHeroDetail(id).subscribe();
  }

  changeName(newName: string): void {
    this.heroDetailDisplayer.askHeroNameChange(newName).pipe(
      finalize(() => this.goBack())
    ).subscribe();
  }
  
  goBack(): void {
    this.location.back();
  }

}
