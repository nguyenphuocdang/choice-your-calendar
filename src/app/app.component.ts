import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Calendar App';
  data: any;

  homepageImage: string = 'assets/images/homepage.png';
  @Input() isUserLoggedIn: boolean = false;
  isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.isUserLoggedIn
  );
  isUserLoggedOut: boolean = false;

  constructor(private http: HttpClient) {}
  ngOnInit() {}
}
