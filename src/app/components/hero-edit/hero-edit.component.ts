import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs';
import IDisplayHeroDetail from 'src/app/domain/ports/i-display-hero-detail';

@Component({
  selector: 'app-hero-edit',
  templateUrl: './hero-edit.component.html',
  styleUrls: ['./hero-edit.component.css']
})
export class HeroEditComponent implements OnInit {

  @Input() heroId = 0;
  @Output() leaveEdit = new EventEmitter<void>();

  constructor(
    @Inject('IDisplayHeroDetail') public heroDetailDisplayer: IDisplayHeroDetail
  ) { }

  ngOnInit(): void {
    this.heroDetailDisplayer.askHeroDetail(this.heroId).subscribe();
  }

  save(newName: string): void {
    this.heroDetailDisplayer.askHeroNameChange(newName).pipe(
      finalize(() => this.leaveEdit.emit())
    ).subscribe();
  }

}
