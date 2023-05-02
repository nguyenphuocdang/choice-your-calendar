import { Component, OnInit, forwardRef, Optional, Inject } from '@angular/core';
//FullCalendar For Angular 14
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';

//FullCalendar For Angular 13
// import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/_services/calendar.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, from, lastValueFrom } from 'rxjs';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { ModifyEventComponent } from '../../popup/modify-event/modify-event.component';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';

//Google Authen
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import Utils from 'src/app/_utils/utils';
import { PopupTemplateComponent } from '../../popup/popup-template/popup-template.component';
import { PopupService } from 'src/app/_services/popup.service';
import {
  FreeTimeScheduleSlots,
  ListTimeWorkingDatas,
  TimeData,
} from 'src/app/_models/schedule';
//Angular Calendar
import { CalendarEvent } from 'angular-calendar';
import { CalendarMonthViewDay } from 'angular-calendar';
import { CalendarView } from 'angular-calendar';
import { SocketService } from 'src/app/_services/socket.service';
import { socketRequest } from 'src/app/_models/request';
import { ApiResponse } from 'src/app/_models/response';

@Component({
  selector: 'app-active-calendar',
  templateUrl: './active-calendar.component.html',
  styleUrls: ['./active-calendar.component.scss'],
})
export class ActiveCalendarComponent implements OnInit {
  views: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  eventsMapping: CalendarEvent[] = [];
  eventsRendered: TimeData[] = [];
  isShowing: boolean = false;

  calendarOptions!: CalendarOptions;
  ACTIVE_EVENTS: EventInput[] = [];
  defaultDate: Date = new Date();
  defaultFromDate: string = this.defaultDate.toISOString().replace(/T.*$/, '');
  defaultToDate: string = new Date(
    this.defaultDate.getFullYear(),
    this.defaultDate.getMonth(),
    this.defaultDate.getDate() + 30
  )
    .toISOString()
    .replace(/T.*$/, '');
  defaultToDateFree: string = new Date(
    this.defaultDate.getFullYear(),
    this.defaultDate.getMonth(),
    this.defaultDate.getDate() + 10
  )
    .toISOString()
    .replace(/T.*$/, '');
  selectInfo!: DateSelectArg;
  scheduleId!: number;
  freeScheduleId!: number;
  googleAuthenUrl: string =
    'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email&access_type=online&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http://localhost:4200/authorize/oauth2/user/callback&client_id=460639175107-rb3km6k5eac1aq9oihqcq1htkhvbqfif.apps.googleusercontent.com';
  freeTimeScheduleSlots: FreeTimeScheduleSlots = {
    name: '',
    brief: '',
    freeScheduleFlag: true,
    listTimeWorkingDatas: [],
  };

  constructor(
    @Optional() private dialog: MatDialog,
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private socketService: SocketService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  async ngOnInit(): Promise<void> {
    // this._getUserActiveCalendar();
    this._testSocketApi();
  }

  private _testSocketApi() {
    const requestBody: socketRequest = {
      content: 'test websocket message',
      messageFrom: '',
      messageFromEmail: '',
      messageTo: 0,
      messageType: 'NOTIFY',
    };
    try {
      this.socketService
        .sendPublicMessage(requestBody)
        .subscribe((response: ApiResponse<any>) => {
          debugger;
        });
    } catch (error) {
      debugger;
    }
  }

  private async _getUserActiveCalendar() {
    try {
      const freeScheduleFlag: boolean = false;
      const fromDate: string = '2023-04-17';
      const toDate: string = '2023-04-23';
      debugger;

      // const activeCalendarResponse: any =
      //   await this.calendarService.viewDefaultCalendarUser(
      //     freeScheduleFlag,
      //     fromDate,
      //     toDate
      //   );
      // if (activeCalendarResponse.statusCode === 200) {
      //   const eventsData: any = activeCalendarResponse.data.scheduleDatas;
      //   eventsData.forEach((element: any) => {
      //     element.timeDatas.forEach((timeData: any) => {
      //       const startTime: string = `${element.day}T${timeData.startTime}`;
      //       const endTime: string = `${element.day}T${timeData.endTime}`;
      //       const eventDataMapping: CalendarEvent = {
      //         start: new Date(startTime),
      //         end: new Date(endTime),
      //         title: `${timeData.title}`,
      //         color: timeData.event
      //           ? {
      //               primary: '#ECD425',
      //               secondary: '#FAE3E3',
      //             }
      //           : {
      //               primary: '#0926B5',
      //               secondary: '#FAE3E3',
      //             },
      //       };
      //       this.eventsMapping.push(eventDataMapping);
      //     });
      //   });
      //   this.events = this.eventsMapping;
      // } else {
      //   debugger;
      //   this.toastrService.error(
      //     activeCalendarResponse.errors[0].errorMessage,
      //     'ERROR'
      //   );
      // }
    } catch (error) {
      debugger;
      this.toastrService.error('Error getting Active Calendar', 'ERROR');
    }
  }

  onDayClicked(day: CalendarMonthViewDay) {
    if (day.events.length == 0) {
      if (this.isShowing) {
        this.isShowing = !this.isShowing;
        this.eventsRendered = [];
      }
    } else {
      if (this.isShowing) {
        {
          this.isShowing = !this.isShowing;
          this.eventsRendered = [];
        }
      } else {
        this.isShowing = !this.isShowing;
        day.events.forEach((element: CalendarEvent) => {
          const start = new Date(element.start);
          const startTime = start.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          const end = new Date(element.end!) ?? '';
          const endTime = end.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          const timeData: TimeData = {
            title: element.title,
            startTime: startTime,
            endTime: endTime,
            event: element.color?.primary == '#ECD425' ? true : false,
          };
          this.eventsRendered.push(timeData);
        });
      }
    }
  }
  toggleCloseNav() {
    if (this.isShowing) this.isShowing = !this.isShowing;
    this.eventsRendered = [];
  }

  private async _getActiveCalendar(
    fromDate: string,
    toDate: string
  ): Promise<EventInput[]> {
    let INITIAL_EVENTS: EventInput[] = [];
    try {
      // const activeCalendar: EventInput[] = this.storageService.getActiveCalendar();
      // if (activeCalendar != null)
      // {
      //   INITIAL_EVENTS = activeCalendar;
      //   this.scheduleId = Number(INITIAL_EVENTS[0].id);
      // }
      // else
      // {

      // }

      const responseActiveCalendar =
        await this.calendarService.getActiveCalendarUsingPromise(
          fromDate,
          toDate
        );
      if (
        responseActiveCalendar != null &&
        responseActiveCalendar.statusMessage == 'Successfully'
      ) {
        this.scheduleId = responseActiveCalendar.data.scheduleId;
        for (
          let i = 0;
          i < (<any>responseActiveCalendar).data.scheduleDatas.length;
          i++
        ) {
          const schedule = (<any>responseActiveCalendar).data.scheduleDatas[i];
          if (schedule.timeDatas.length > 0) {
            for (let j = 0; j < schedule.timeDatas.length; j++) {
              const event: EventInput = {
                id: '' + (<any>responseActiveCalendar).data.scheduleId,
                title: schedule.timeDatas[j].title,
                start:
                  '' +
                  schedule.day +
                  'T' +
                  schedule.timeDatas[j].startTime +
                  ':00',
                end:
                  '' +
                  schedule.day +
                  'T' +
                  schedule.timeDatas[j].endTime +
                  ':00',
              };
              INITIAL_EVENTS.push(event);
            }
          }
        }
      }

      return INITIAL_EVENTS;
    } catch (error) {
      //handle error
    }
    return INITIAL_EVENTS;
  }

  addMoreEventClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'ADD MORE EVENT',
      scheduleId: this.scheduleId,
      selectInfo: this.selectInfo,
    };
    this.dialog.open(ModifyEventComponent, dialogConfig);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    let _selectedDate = selectInfo.start.toDateString();
    let _convertSelectedDateStart: Date = new Date(selectInfo.startStr);
    let _convertSelectedDateEnd: Date = new Date(selectInfo.endStr);
    let _convertSelectedStartTime: string =
      _convertSelectedDateStart.toLocaleTimeString();
    let _convertSelectedEndTime: string =
      _convertSelectedDateEnd.toLocaleTimeString();

    let _selectedStartDate: Date = new Date(selectInfo.start);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'ADD MORE EVENT',
      scheduleId: this.scheduleId,
      selectInfo: this.selectInfo,
      date: _selectedDate,
      startTime: _convertSelectedStartTime,
      endTime: _convertSelectedEndTime,
    };
    // this.dialog.open(ModifyEventComponent, dialogConfig);

    const dialogRef = this.dialog.open(ModifyEventComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((response: any) => {
      debugger;
      if (response.isModified == true) {
        calendarApi.addEvent({
          id: '',
          title: response.title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        });
      } else {
      }
    });

    //   for (let i = 0; i < this.ACTIVE_EVENTS.length; i++)
    //   {
    //     let _convertStartToString: string = this.ACTIVE_EVENTS[i].start?.toLocaleString() ?? '';
    //     let _convertStartToDate = new Date(_convertStartToString);
    //     let _convertStartToDateString = _convertStartToDate.toDateString();
    //     if (_selectedDate == _convertStartToDateString)
    //     {
    //       let _convertStartToTimeString = _convertStartToDate.toTimeString();
    //       let _convertEndToString: string = this.ACTIVE_EVENTS[i].end?.toLocaleString() ?? '';
    //       let _convertEndToDate = new Date(_convertEndToString);
    //       let _convertEndToTimeString = _convertEndToDate.toTimeString();

    //       const dialogConfig = new MatDialogConfig();
    //       console.log(this.scheduleId);
    //       dialogConfig.data =
    //       {
    //         title: 'ADD MORE EVENT',
    //         scheduleId: this.scheduleId,
    //         selectInfo: this.selectInfo,
    //         date: _selectedDate,
    //         startTime: _convertSelectedStartTime,
    //         endTime: _convertSelectedEndTime,
    //       };

    //       // this.dialog.open(ModifyEventComponent, dialogConfig);

    //       const dialogRef = this.dialog.open(ModifyEventComponent, dialogConfig);

    //       dialogRef.afterClosed().subscribe((response: any) =>
    //       {
    //         debugger
    //       });

    //       // if (this._isOverlap(_convertSelectedStartTime,_convertSelectedEndTime,_convertStartToTimeString,_convertEndToTimeString))
    //       // {
    //       //   this.toastrService.error('Time Overlapping', 'Error');
    //       // }

    //       // else
    //       // {

    //       //   // this.date = _selectedDate;
    //       //   // this.bookingEvent.startTime = selectInfo.startStr.toString();
    //       //   // this.bookingEvent.endTime = selectInfo.endStr.toString();
    //     }
    // }
  }

  _isOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean {
    if (startA < endB && endA > startB) {
      return true;
    }
    return false;
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  }

  asyncGoogleCalendar() {
    localStorage.setItem('status', 'not-booking');
    this.popupService.confirmPopup(this.dialog, Utils.confirmSyncGoogle);
    this.popupService.openNewTabAfterClose(this.googleAuthenUrl);
  }

  async _getFreeTimeSchedules(
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ) {
    try {
      const response: any = await this.calendarService.getFreeTimeSlotsPromise(
        fromDate,
        toDate,
        freeScheduleFlag
      );
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        this.freeScheduleId = response.data.scheduleId;

        for (let i = 0; i < (<any>response).data.scheduleDatas.length; i++) {
          const schedule = (<any>response).data.scheduleDatas[i];
          if (schedule.timeDatas.length > 0) {
            for (let j = 0; j < schedule.timeDatas.length; j++) {
              const freeSlots: ListTimeWorkingDatas = {
                startTime: schedule.timeDatas[j].startTime,
                endTime: schedule.timeDatas[j].endTime,
                weekday: schedule.day,
                title: '',
              };
              this.freeTimeScheduleSlots.listTimeWorkingDatas.push(freeSlots);
            }
          }
        }
      }
    } catch (error) {
      //handle error
    }
  }

  //Add Schedule

  //Add Events

  toggleWeekends() {
    // make a copy while overriding some values
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends,
    };
  }
}
