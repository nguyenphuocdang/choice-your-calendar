import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  // templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  template: `
    <app-nav></app-nav>
    <!-- <div class="container">
      <ng-content></ng-content>
    </div> -->
  `,
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
