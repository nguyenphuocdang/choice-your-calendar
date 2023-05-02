import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import { ToastrService } from 'ngx-toastr';
import { EventCreateRequest } from 'src/app/_models/event';
import {
  FreeTimeScheduleSlots,
  ListTimeWorkingDatas,
} from 'src/app/_models/schedule';
import { CalendarService } from 'src/app/_services/calendar.service';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { PopupService } from 'src/app/_services/popup.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-public-calendar',
  templateUrl: './public-calendar.component.html',
  styleUrls: ['./public-calendar.component.css'],
})
export class PublicCalendarComponent implements OnInit {
  partnerEmail: string = '';
  fromDate: string = '';
  toDate: string = '';
  date: string = '';
  inputStartTime = '';
  inputEndTime = '';
  EVENTS: EventInput[] = [];
  COMPARED_EVENTS: EventInput[] = [];
  calendarOptions!: CalendarOptions;
  isCompared: boolean = false;
  duration: string = '';

  bookingEvent: EventCreateRequest = {
    eventName: '',
    eventDescription: 'Booking Meeting',
    partnerPathMapping: '',
    startTime: '',
    endTime: '',
    authorizationCode: '',
    redirecetUri: Utils.CALLBACK_AUTH_BOOK,
  };

  freeScheduleId!: number;
  freeTimeScheduleSlots: FreeTimeScheduleSlots = {
    name: '',
    brief: '',
    freeScheduleFlag: true,
    listTimeWorkingDatas: [],
  };

  constructor(
    @Optional() private dialog: MatDialog,
    private Activatedroute: ActivatedRoute,
    private calendarService: CalendarService,
    private eventService: EventService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    private localStorageService: LocalStorageService
  ) {
    this.bookingEvent.partnerPathMapping =
      this.Activatedroute.snapshot.paramMap.get('pathMapping') ?? '';
    this.partnerEmail =
      this.Activatedroute.snapshot.paramMap.get('pathMapping') + '@gmail.com' ??
      '';
    this.fromDate =
      this.Activatedroute.snapshot.queryParamMap.get('fromDate') ?? '';
    this.toDate =
      this.Activatedroute.snapshot.queryParamMap.get('toDate') ?? '';
    this.duration =
      this.Activatedroute.snapshot.queryParamMap.get('duration') ?? '';
  }

  async ngOnInit(): Promise<void> {
    // this.EVENTS = await this._getPublicCalendar(this.bookingEvent.partnerPathMapping, this.fromDate, this.toDate);
    // if (this.EVENTS.length > 0)
    // {
    //   this.calendarOptions = {
    //     headerToolbar: {
    //       left: 'prev,next today',
    //       center: 'title',
    //       right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    //     },
    //     initialView: 'dayGridMonth',
    //     events:  this.EVENTS, // alternatively, use the `events` setting to fetch from a feed
    //     weekends: true,
    //     editable: true,
    //     selectable: true,
    //     selectMirror: true,
    //     dayMaxEvents: true,
    //     eventColor: '#378006',
    //     select: this.handleDateSelect.bind(this),
    //     eventOverlap: function(stillEvent, movingEvent)
    //     {
    //       console.log('overlap')
    //       return true;
    //     }
    //     // eventClick: this.handleEventClick.bind(this),
    //     // eventsSet: this.handleEvents.bind(this)
    //     /* you can update a remote database when these fire:
    //     eventAdd:
    //     eventChange:
    //     eventRemove:
    //     */
    //   };
    // }
    await this._getPublicFreeTimeSchedules(
      this.bookingEvent.partnerPathMapping,
      this.fromDate,
      this.toDate,
      true
    );
  }

  private async _getPublicCalendar(
    pathMapping: string,
    fromDate: string,
    toDate: string
  ) {
    let INITIAL_EVENTS: EventInput[] = [];
    try {
      const responsePublicCalendar =
        await this.calendarService.getPublicCalendarUsingPromise(
          pathMapping,
          fromDate,
          toDate
        );
      if (
        responsePublicCalendar != null &&
        responsePublicCalendar.statusMessage == 'Successfully'
      ) {
        for (
          let i = 0;
          i < (<any>responsePublicCalendar).data.scheduleDatas.length;
          i++
        ) {
          const schedule = (<any>responsePublicCalendar).data.scheduleDatas[i];
          if (schedule.timeDatas.length > 0) {
            for (let j = 0; j < schedule.timeDatas.length; j++) {
              const event: EventInput = {
                id: '' + (<any>responsePublicCalendar).data.scheduleId,
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

  async _getPublicFreeTimeSchedules(
    pathMapping: string,
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ) {
    try {
      const response: any =
        await this.calendarService.getPublicFreeTimeUsingPromise(
          pathMapping,
          fromDate,
          toDate,
          freeScheduleFlag
        );
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        this.freeScheduleId = response.data.scheduleId;
        this.freeTimeScheduleSlots.listTimeWorkingDatas = [];
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
              freeSlots.weekday = freeSlots.weekday
                .split('-')
                .reverse()
                .join('-');
              this.freeTimeScheduleSlots.listTimeWorkingDatas.push(freeSlots);
            }
          }
        }
      }
    } catch (error) {
      //handle error
    }
  }

  _addEvent() {
    // console.log(this.bookingEvent);
    // if (!this._verifyBookingInfo(this.date, this.bookingEvent.startTime, this.bookingEvent.endTime))
    // {
    //   return ;
    // }
    // else
    // {
    //   let _startTimeUTC: string = this._convertTimeRequestFormat(this.date,this.bookingEvent.startTime);
    //   let _endTimeUTC: string = this._convertTimeRequestFormat(this.date,this.bookingEvent.endTime);
    //   let requestBody : EventCreateRequest = this.bookingEvent;
    //   requestBody.startTime = _startTimeUTC;
    //   requestBody.endTime = _endTimeUTC;
    // };

    this.popupService.confirmPopup(this.dialog, Utils.confirmBook);
    this.popupService.$isConfirm.subscribe((isConfirm) => {
      if (this.popupService.isConfirm) {
        let requestBody: EventCreateRequest = this.bookingEvent;
        //Convert UTC format for start time and end time
        let _reverseDate = this.date.split('-').reverse().join('-');
        let _convertToDateStart: Date = new Date(
          _reverseDate + 'T' + requestBody.startTime + ':00'
        );
        let _convertToDateEnd: Date = new Date(
          _reverseDate + 'T' + requestBody.endTime + ':00'
        );
        _convertToDateStart.setHours(_convertToDateStart.getHours() + 7);
        _convertToDateEnd.setHours(_convertToDateEnd.getHours() + 7);
        let _convertToStringStart = _convertToDateStart.toISOString();
        let _convertToStringEnd = _convertToDateEnd.toISOString();
        requestBody.startTime = _convertToStringStart;
        requestBody.endTime = _convertToStringEnd;
        let googleAuthenUrl: string =
          'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email&access_type=online&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http://localhost:4200/authorize/oauth2/user/callback&client_id=460639175107-rb3km6k5eac1aq9oihqcq1htkhvbqfif.apps.googleusercontent.com';
        localStorage.setItem('status', 'in booking');
        localStorage.setItem('createEventBody', JSON.stringify(requestBody));
        let newWindow = window.open(googleAuthenUrl, '_blank');

        // this.eventService.createNewEvent(
        //   requestBody
        //   ).subscribe(
        //     (response: any) =>
        //       {
        //         debugger
        //         if (response.statusCode == 200)
        //         {
        //           this.toastrService.success('Booking Successfully', 'Success 200');
        //         }
        //         else
        //         {
        //           this.toastrService.error(response.errors[0].errorMessage,'400 ERROR');
        //         }

        //       }
        //   )

        // localStorage.setItem('status','in booking');
        // localStorage.setItem('authorizationCode','');

        // let code : string = (localStorage.getItem('authorizationCode')) ?? '';
        // this.localStorageService.itemValue.subscribe(
        //   (result: any) =>
        //   {
        //     debugger
        //     if (localStorage.getItem('authorizationCode') != '')
        //     {
        //       debugger
        //     }
        //   }
        // )
      }

      this.popupService.isConfirm = false;
    });

    // let requestBody : EventCreateRequest = this.bookingEvent;

    // this.eventService.createNewEvent(
    //   requestBody
    // ).subscribe(
    //   (response: any) =>
    //   {
    //     if (response.statusCode == 200)
    //     {
    //       this.toastrService.success('Booking Successfully', 'Success 200');

    //     }
    //   }
    // )
  }

  _convertTimeRequestFormat(
    datePickerInput: string,
    timeInput: string
  ): string {
    let _convertToDate = new Date(datePickerInput);
    let _convertToUTCTime = timeInput;
    let time = new Date(
      _convertToDate.toString().split(':')[0].slice(0, -2) + _convertToUTCTime
    );
    return time.toISOString();
  }

  _verifyBookingInfo(
    datePickerInput: string,
    startTime: string,
    endTime: string
  ): boolean {
    let inValid: boolean = false;
    if (datePickerInput == '') {
      this.toastrService.error('Date Selected must not be blank', 'ERROR');
      return inValid;
    }
    if (startTime == '') {
      this.toastrService.error('Start Time must not be blank', 'ERROR');
      return inValid;
    }
    if (endTime == '') {
      this.toastrService.error('End Time must not be blank', 'ERROR');
      return inValid;
    }
    if (startTime >= endTime) {
      this.toastrService.error(
        'Start Time must not be larger than End Time',
        'ERROR'
      );
      return inValid;
    }
    let _convertToDate = new Date(datePickerInput);
    let _currentDate = new Date();
    if (_convertToDate < _currentDate) {
      this.toastrService.error('Date Selected must not in the past', 'ERROR');
      return inValid;
    }
    inValid = true;
    return inValid;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    let _selectedDate = selectInfo.start.toDateString();
    let _convertSelectedDateStart: Date = new Date(selectInfo.startStr);
    let _convertSelectedDateEnd: Date = new Date(selectInfo.endStr);
    let _convertSelectedStartTime: string =
      _convertSelectedDateStart.toTimeString();
    let _convertSelectedEndTime: string =
      _convertSelectedDateEnd.toTimeString();

    let _selectedStartDate: Date = new Date(selectInfo.start);

    let currentDate: Date = new Date();
    let _currentDate: string = currentDate.toDateString();
    if (_currentDate > _selectedDate) {
      this.toastrService.error('Time must not be in the past', 'Error');
    } else {
      for (let i = 0; i < this.EVENTS.length; i++) {
        let _convertStartToString: string =
          this.EVENTS[i].start?.toLocaleString() ?? '';
        let _convertStartToDate = new Date(_convertStartToString);
        let _convertStartToDateString = _convertStartToDate.toDateString();
        if (_selectedDate == _convertStartToDateString) {
          let _convertStartToTimeString = _convertStartToDate.toTimeString();
          let _convertEndToString: string =
            this.EVENTS[i].end?.toLocaleString() ?? '';
          let _convertEndToDate = new Date(_convertEndToString);
          let _convertEndToTimeString = _convertEndToDate.toTimeString();

          if (
            this._isOverlap(
              _convertSelectedStartTime,
              _convertSelectedEndTime,
              _convertStartToTimeString,
              _convertEndToTimeString
            )
          ) {
            this.toastrService.error('Time Overlapping', 'Error');
          } else {
            this.date = _selectedDate;
            this.bookingEvent.startTime = selectInfo.startStr.toString();
            this.bookingEvent.endTime = selectInfo.endStr.toString();

            const calendarApi = selectInfo.view.calendar;
            calendarApi.addEvent({
              id: '',
              title: '',
              start: selectInfo.startStr,
              end: selectInfo.endStr,
            });
          }
        }
      }
    }

    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
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

  async getComparedCalendar() {
    this.isCompared = true;

    const responseComparedCalendar: any =
      await this.calendarService.getComparedCalendarPromise(
        this.bookingEvent.partnerPathMapping,
        this.fromDate,
        this.toDate,
        true
      );
    if (
      responseComparedCalendar.statusCode === 200 &&
      (<any>responseComparedCalendar).data.scheduleDatas.length > 0
    ) {
      this.freeScheduleId = (<any>responseComparedCalendar).data.scheduleId;
      this.freeTimeScheduleSlots.listTimeWorkingDatas = [];

      for (
        let i = 0;
        i < (<any>responseComparedCalendar).data.scheduleDatas.length;
        i++
      ) {
        const schedule = (<any>responseComparedCalendar).data.scheduleDatas[i];
        if (schedule.timeDatas.length > 0) {
          for (let j = 0; j < schedule.timeDatas.length; j++) {
            const freeSlots: ListTimeWorkingDatas = {
              startTime: schedule.timeDatas[j].startTime,
              endTime: schedule.timeDatas[j].endTime,
              weekday: schedule.day,
              title: '',
            };
            freeSlots.weekday = freeSlots.weekday
              .split('-')
              .reverse()
              .join('-');
            this.freeTimeScheduleSlots.listTimeWorkingDatas.push(freeSlots);
          }
        }
      }
      // this.toastrService.info('The ideal time for booking is in white color')
      // this.calendarOptions.eventColor = '#FDF8B7';
      // this.calendarOptions.displayEventTime = false;
      // this.calendarOptions.events = this.COMPARED_EVENTS
    }
  }

  onSelectFreeTimeSlot(slot: any) {
    this.bookingEvent.eventName = 'New Appointment';
    this.date = slot.weekday;
    this.bookingEvent.startTime = slot.startTime;
    let additionalTime: number = 0;
    if (this.duration == '15-minute') additionalTime = 15;
    else if (this.duration == '30-minute') additionalTime = 30;
    else if (this.duration == '45-minute') additionalTime = 45;
    else if (this.duration == '60-minute') additionalTime = 60;
    let tempDate = slot.weekday;
    tempDate = tempDate.split('-').reverse().join('-');
    let _convertToDate: Date = new Date(
      tempDate + 'T' + slot.startTime + ':00'
    );
    _convertToDate.setMinutes(_convertToDate.getMinutes() + additionalTime);
    let _convertToString = _convertToDate.toTimeString();
    const [time, modifier] = _convertToString.split(':00 ');
    this.bookingEvent.endTime = time;
  }

  getAllTimeSlots() {
    this._getPublicFreeTimeSchedules(
      this.bookingEvent.partnerPathMapping,
      this.fromDate,
      this.toDate,
      true
    );
  }
}
