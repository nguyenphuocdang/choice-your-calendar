import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';
import { EventCreateRequest } from 'src/app/_models/event';
import { CalendarService } from 'src/app/_services/calendar.service';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-public-calendar',
  templateUrl: './public-calendar.component.html',
  styleUrls: ['./public-calendar.component.css']
})
export class PublicCalendarComponent implements OnInit {

  partnerEmail: string = '';
  fromDate: string = '';
  toDate: string = '';
  date: string = '';
  inputStartTime = '';
  inputEndTime = '';
  EVENTS: EventInput[] = [];
  calendarOptions!: CalendarOptions;

  bookingEvent: EventCreateRequest = {
    eventName: '',
    eventDescription: 'Booking Meeting',
    partnerPathMapping: '',
    startTime: '',
    endTime: '',
  }
  
  constructor(
    private Activatedroute:ActivatedRoute,
    private calendarService: CalendarService,
    private eventService: EventService,
    private toastrService: ToastrService) 
  {
    this.bookingEvent.partnerPathMapping = this.Activatedroute.snapshot.paramMap.get('pathMapping') ?? '';
    this.partnerEmail = this.Activatedroute.snapshot.paramMap.get('pathMapping') + '@gmail.com' ?? '';
    this.fromDate = this.Activatedroute.snapshot.queryParamMap.get('fromDate') ?? '';
    this.toDate = this.Activatedroute.snapshot.queryParamMap.get('toDate') ?? '';
   }

  async ngOnInit(): Promise<void> 
  {
    this.EVENTS = await this._getPublicCalendar(this.bookingEvent.partnerPathMapping, '2022-12-07', '2022-12-14');
    // this.EVENTS = await this._getPublicCalendar(this.pathMapping, this.fromDate, this.toDate);
    if (this.EVENTS.length > 0)
    {
      this.calendarOptions = {       
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        events:  this.EVENTS, // alternatively, use the `events` setting to fetch from a feed
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventColor: '#378006',
        select: this.handleDateSelect.bind(this),
        eventOverlap: function(stillEvent, movingEvent)
        {
          console.log('overlap')
          return true;
        }
        // eventClick: this.handleEventClick.bind(this),
        // eventsSet: this.handleEvents.bind(this)
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      };
    }
  }

  private async _getPublicCalendar(pathMapping: string, fromDate: string, toDate: string)
  {
    let INITIAL_EVENTS : EventInput[] = [];
    try 
    {
        const responsePublicCalendar = await this.calendarService.getPublicCalendarUsingPromise(pathMapping,fromDate,toDate);
        if (responsePublicCalendar != null && responsePublicCalendar.statusMessage == 'Successfully')
        {
            for (let i = 0; i < (<any>responsePublicCalendar).data.scheduleDatas.length;i++)
            {
              const schedule = (<any>responsePublicCalendar).data.scheduleDatas[i];
              if (schedule.timeDatas.length > 0)
              {
                for (let j = 0 ; j < schedule.timeDatas.length; j ++)
                {
                  const event: EventInput = 
                  {
                    id: ""+(<any>responsePublicCalendar).data.scheduleId,
                    title: schedule.timeDatas[j].title,        
                    start: "" + schedule.day + 'T' + schedule.timeDatas[j].startTime+':00',
                    end: "" + schedule.day +'T' + schedule.timeDatas[j].endTime+':00', 
                  }
                  INITIAL_EVENTS.push(event);
                }
              }
            }
        } 
        return INITIAL_EVENTS;
    } 
    catch (error) 
    {
      //handle error
    }
    return INITIAL_EVENTS;    
  }

  _addEvent()
  {
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
    debugger
    let requestBody : EventCreateRequest = this.bookingEvent;

    this.eventService.createNewEvent(
      requestBody
    ).subscribe(
      (response: any) =>
      {
        debugger
        if (response.statusCode == 200)
        {
          this.toastrService.success('Booking Successfully', 'Success 200');

        }
      }
    )
  }

  _convertTimeRequestFormat(datePickerInput: string, timeInput: string) : string
  {
    let _convertToDate = new Date(datePickerInput);
    let _convertToUTCTime = timeInput;
    let time = new Date(_convertToDate.toString().split(":")[0].slice(0,-2) + _convertToUTCTime);
    debugger
    return time.toISOString();
  }

  _verifyBookingInfo(datePickerInput: string, startTime: string, endTime : string) : boolean
  {
    let inValid: boolean = false;
    if (datePickerInput == '')
    {
      this.toastrService.error('Date Selected must not be blank', 'ERROR');
      return inValid;
    }
    if (startTime == '')
    {
      this.toastrService.error('Start Time must not be blank', 'ERROR');
      return inValid;
    }
    if (endTime == '')
    {
      this.toastrService.error('End Time must not be blank', 'ERROR');
      return inValid;
    }
    if (startTime >= endTime)
    {
      this.toastrService.error('Start Time must not be larger than End Time', 'ERROR');
      return inValid;
    }
    let _convertToDate = new Date(datePickerInput);
    let _currentDate = new Date();
    if (_convertToDate < _currentDate)
    {
      this.toastrService.error('Date Selected must not in the past', 'ERROR');
      return inValid;
    }
      inValid = true;
    return inValid;
  }

  handleDateSelect(selectInfo: DateSelectArg) 
  {
    let _selectedDate = selectInfo.start.toDateString();
    let _convertSelectedDateStart: Date = new Date(selectInfo.startStr);
    let _convertSelectedDateEnd: Date = new Date(selectInfo.endStr);
    let _convertSelectedStartTime: string = _convertSelectedDateStart.toTimeString();
    let _convertSelectedEndTime: string = _convertSelectedDateEnd.toTimeString();
    
    let _selectedStartDate : Date = new Date(selectInfo.start);
    for (let i = 0; i < this.EVENTS.length; i++)
    {
      let _convertStartToString: string = this.EVENTS[i].start?.toLocaleString() ?? '';
      let _convertStartToDate = new Date(_convertStartToString);
      let _convertStartToDateString = _convertStartToDate.toDateString();
      if (_selectedDate == _convertStartToDateString)
      {
        let _convertStartToTimeString = _convertStartToDate.toTimeString();
        let _convertEndToString: string = this.EVENTS[i].end?.toLocaleString() ?? '';
        let _convertEndToDate = new Date(_convertEndToString);
        let _convertEndToTimeString = _convertEndToDate.toTimeString();
        if (this._isOverlap(_convertSelectedStartTime,_convertSelectedEndTime,_convertStartToTimeString,_convertEndToTimeString))
        {
          this.toastrService.error('Time Overlapping', 'Error');
        }
        else 
        {
          this.date = _selectedDate;
          this.bookingEvent.startTime = selectInfo.startStr.toString();
          this.bookingEvent.endTime = selectInfo.endStr.toString();
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

  _isOverlap(startA: string, endA: string, startB: string, endB: string) : boolean
  {
    if ((startA < endB) && (endA > startB))
    {
      return true;
    }
    return false;
  }
}
