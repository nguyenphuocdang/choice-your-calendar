import { Component, OnInit, forwardRef, Optional, Inject } from '@angular/core';
//FullCalendar For Angular 14
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, EventInput } from '@fullcalendar/core';

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
  ScheduleDatas,
  TimeData,
} from 'src/app/_models/schedule';
//Angular Calendar
import { CalendarEvent } from 'angular-calendar';
import { CalendarMonthViewDay } from 'angular-calendar';
import { CalendarView } from 'angular-calendar';
import { SocketService } from 'src/app/_services/socket.service';
import { socketRequest } from 'src/app/_models/request';
import { ApiResponse } from 'src/app/_models/response';
import { OrganizationService } from 'src/app/_services/organization.service';
import { UserProfile } from 'src/app/_models/user';

@Component({
  selector: 'app-active-calendar',
  templateUrl: './active-calendar.component.html',
  styleUrls: ['./active-calendar.component.scss'],
})
export class ActiveCalendarComponent implements OnInit {
  views: CalendarView = CalendarView.Month;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  monthEvents: CalendarEvent[] = [];
  eventsRendered: TimeData[] = [];
  dayClickSelected: string = '';
  isShowing: boolean = false;
  weekdays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
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
    'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email&access_type=online&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https://timechoice.solutions/authorize/oauth2/user/callback&client_id=460639175107-rb3km6k5eac1aq9oihqcq1htkhvbqfif.apps.googleusercontent.com';
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
    private organizationService: OrganizationService,
    private storageService: LocalStorageService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  async ngOnInit(): Promise<void> {
    this._getUserActiveCalendar();
  }

  private async _getUserActiveCalendar() {
    try {
      const freeScheduleFlag: boolean = false;
      const today: Date = new Date();
      const currentMonth: number = today.getMonth() + 1;
      const currentYear: number = today.getFullYear();
      const _firstDayOfCurrentMonth: string = this._convertYYYYMMDD(
        1,
        currentMonth,
        currentYear
      );
      const _firstDayOfNextMonth: string = this._convertYYYYMMDD(
        1,
        currentMonth + 1,
        currentYear
      );

      const user: UserProfile = this.storageService.getUserProfile();
      const userId: number = user.id;
      this.organizationService
        .viewActiveCalendar(
          userId,
          freeScheduleFlag,
          _firstDayOfCurrentMonth,
          _firstDayOfNextMonth
        )
        .subscribe((response: ApiResponse<ScheduleDatas>) => {
          if (response.statusCode === 200) {
            const eventsMapping: CalendarEvent[] = [];
            response.data.scheduleDatas.forEach((schedule, index) => {
              if (schedule.timeDatas.length > 0) {
                schedule.timeDatas.forEach((timeData, index) => {
                  const startTime: string = `${schedule.day}T${timeData.startTime}`;
                  const endTime: string = `${schedule.day}T${timeData.endTime}`;
                  const eventDataMapping: CalendarEvent = {
                    start: new Date(startTime),
                    end: new Date(endTime),
                    title: `${timeData.title}`,
                    cssClass: 'event-schedule',
                  };
                  if (timeData.event)
                    eventDataMapping.color = {
                      primary: '#005ECA',
                      secondary: '#DFEEFF',
                      secondaryText: '#000000',
                    };
                  else {
                    if (timeData.title === 'Morning Work') {
                      eventDataMapping.color = {
                        primary: '#EED600',
                        secondary: '#F3E77E',
                        secondaryText: '#000000',
                      };
                    } else {
                      eventDataMapping.color = {
                        primary: '#F36529',
                        secondary: '#F5D3C4',
                        secondaryText: '#000000',
                      };
                    }
                  }
                  eventsMapping.push(eventDataMapping);
                });
              }
            });
            this.monthEvents = eventsMapping;
          } else {
            debugger;
            this.toastrService.error('Error getting Active Calendar', 'ERROR');
          }
        });
    } catch (error) {
      debugger;
      this.toastrService.error('Error getting Active Calendar', 'ERROR');
    }
  }

  _convertYYYYMMDD(day: number, month: number, year: number): string {
    const dayString: string = day < 10 ? `0${day}` : `${day}`;
    const monthString: string = month < 10 ? `0${month}` : `${month}`;
    const yearString: string = `${year}`;
    const formatDay: string = `${yearString}-${monthString}-${dayString}`;
    return formatDay;
  }

  onDayClicked(day: CalendarMonthViewDay) {
    let dateSelected: Date = new Date(day.date);
    this.dayClickSelected = `${
      this.weekdays[dateSelected.getDay()]
    }, ${Utils.convertFromDatetoDDMMYY(dateSelected)}`;
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
            event: element.color?.primary == '#005ECA' ? true : false,
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
  closeOpenMonthViewDay() {}

  setView(view: CalendarView) {
    this.view = view;
  }
  getEventBCount(day: CalendarMonthViewDay): number {
    // Logic to calculate the count of Event B for the given day
    // You can access the day.events array and filter by the Event B criteria to count Event B occurrences
    // return day.events.filter(event => /* check if it's an Event B */).length;
    return 5;
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
