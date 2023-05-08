import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventCreateRequest } from 'src/app/_models/event';
import { CalendarService } from 'src/app/_services/calendar.service';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-google-authen',
  templateUrl: './google-authen.component.html',
  styleUrls: ['./google-authen.component.css'],
})
export class GoogleAuthenComponent implements OnInit {
  syncStatus: string = 'isLoading';
  messageDefault: string = 'Calendar Data is being asynced....';
  messageSuccess: string = Utils.syncSuccessMessage;
  messageError: string = Utils.syncErrorDefaultMessage;
  authorizationCode: string = '';
  accountType: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private calendarService: CalendarService,
    private localStorageService: LocalStorageService,
    private eventService: EventService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (this.activatedRoute.snapshot.queryParamMap.get('code')) {
      this.authorizationCode =
        this.activatedRoute.snapshot.queryParamMap.get('code') ?? '';
    }
    if (this.activatedRoute.snapshot.queryParamMap.get('state')) {
      this.accountType =
        this.activatedRoute.snapshot.queryParamMap.get('state') ?? '';
    }
  }

  async ngOnInit(): Promise<void> {
    debugger;
    if (this.authorizationCode != '') {
      this.router.navigate(['/provide-info'], {
        state: {
          authorizationCode: this.authorizationCode,
          accountType: this.accountType,
        },
      });
      //   this.localStorageService.AUTHORIZATION_CODE = this.authorizationCode;
      //   this.localStorageService.setAuthorizationCode(this.authorizationCode);
      //   if (localStorage.getItem('status') == 'in booking') {
      //     // window.opener.postMessage({ authorizationCode: this.authorizationCode }, '*');
      //     const requestBody: EventCreateRequest = JSON.parse(
      //       localStorage.getItem('createEventBody')!
      //     );
      //     requestBody.authorizationCode = this.authorizationCode;
      //     this.eventService
      //       .createNewEvent(requestBody)
      //       .subscribe((response: any) => {
      //         debugger;
      //         if (response.statusCode == 200) {
      //           this.syncStatus = 'isBooked';
      //           this.toastrService.success('Booking Successfully', 'Success 200');
      //         } else {
      //           this.toastrService.error(
      //             response.errors[0].errorMessage,
      //             '400 ERROR'
      //           );
      //         }
      //       });

      //     // window.close();
      //   } else {
      //     this.Activatedroute.params.subscribe(() => {
      //       this._asyncCalendar(this.authorizationCode);
      //     });
      //   }
      // }
    }

    // _asyncCalendar(code: string) {
    //   this.calendarService
    //     .asyncGoogleCalendar(code)
    //     .subscribe((response: any) => {
    //       debugger;
    //       if (response.statusCode === 200 && response.data == true) {
    //         this.syncStatus = 'success';
    //       } else if (
    //         response.statusCode === 500 &&
    //         response.errors[0].errorCode == '500'
    //       ) {
    //         this.messageError = Utils.syncErrorSameCodeMessage;
    //         this.syncStatus = 'error';
    //       } else {
    //         this.syncStatus = 'error';
    //       }
    //     });
  }
}
