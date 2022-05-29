import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-admin-panel></app-admin-panel>
    <app-messages></app-messages>
  `,
  styleUrls: ['./app.component.css']
})
export class AdminAppComponent {
  title = 'Tour of Heroes';
}
