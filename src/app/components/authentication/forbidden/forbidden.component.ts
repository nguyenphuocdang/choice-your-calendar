import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css'],
})
export class ForbiddenComponent implements OnInit {
  constructor() {}

  statusCode: string = '403 FORBIDDEN';
  errorMessage: string = 'You are not allowed to access this page';

  ngOnInit(): void {}
}
