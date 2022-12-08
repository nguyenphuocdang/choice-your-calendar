import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './_services/local-storage.service';
//FullCalendar
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
// import dayGridPlugin from '@fullcalendar/daygrid';

// make the <full-calendar> element globally available by calling this function at the top-level
// defineFullCalendarElement();
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Calendar App';
  data: any;

  homepageImage: string = 'assets/images/homepage.png'
  @Input() isUserLoggedIn: boolean = false;
  isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(this.isUserLoggedIn);
  isUserLoggedOut: boolean = false;

  constructor(private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService,)
  {
    // debugger
    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation!.extras.state as {message: string};
    // console.log(this.router.getCurrentNavigation()!.extras!.state);
  }
  ngOnInit() 
  {
    // const state = this.router.getCurrentNavigation()!.extras.state;
    // const value = this.activatedRoute.snapshot.data['key'];
    // this._verifyUser();
  }

  loginAdmin()
  {
    this.http.post('https://choose-calendar-app.herokuapp.com/api/auth/basic-login',
    {"password": "123",
    "username": "admin"}).subscribe(response => 
      {
        this.data = response;
      }           
    );
  }

  // calendarOptions: CalendarOptions = {
  //   plugins: [dayGridPlugin],
  //   headerToolbar: {
  //     left: 'prev,next today',
  //     center: 'title',
  //     right: 'dayGridMonth,dayGridWeek,dayGridDay'
  //   }
  // }

  private _verifyUser()
  {
    debugger
    const token = this.storageService.getAccessToken();
    if (token != null)
    {
      this.isUserLoggedIn = true;
      this.isUserLoggedIn$.next(this.isUserLoggedIn);
    }
  }

}
