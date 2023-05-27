import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './_services/local-storage.service';
import { SocketService } from './_services/socket.service';
//FullCalendar
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
// import dayGridPlugin from '@fullcalendar/daygrid';

// make the <full-calendar> element globally available by calling this function at the top-level
// defineFullCalendarElement();
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
