import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-layout',
  template: ` <app-bottom-nav></app-bottom-nav> `,
  styleUrls: ['./bottom-layout.component.css'],
})
export class BottomLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
