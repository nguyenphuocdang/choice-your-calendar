import { Component, OnInit, forwardRef, Optional, Inject  } from '@angular/core';
//FullCalendar For Angular 14
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, interactionSettingsStore } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';

//FullCalendar For Angular 13
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from '@fullcalendar/angular'; 
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/_services/calendar.service';


@Component({
  selector: 'app-detail-schedule',
  templateUrl: './detail-schedule.component.html',
  styleUrls: ['./detail-schedule.component.css']
})
export class DetailScheduleComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  INITIAL_EVENTS : EventInput[] = [];
  isMenuVisible = false;
  darkTheme = false;
  firstDemoLoaded = false;
  currentEvents: EventApi[] = [];
  constructor(
    @Optional() private dialog: MatDialog,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: EventInput[],
    private calendarService: CalendarService,
  ) { }

  ngOnInit(){
    const INITIAL_EVENTS: EventInput[] = this.data
    forwardRef(() => Calendar);
    this.calendarOptions = {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialView: 'dayGridMonth',
      events: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this)
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      */
     
     
    };

  }

  scheduleDetails: any = [
    { 
      // brief: 'Schedule 01', 
      // listTimeWorkingDatas: [{startTime: '09:00', endTime: '18:00', weekDay: 'FRIDAY'}],
      // name: 'Schedule 01', 
      title: 'Event 01', date: '2022-10-17', textColor: '#A6F3C5'
    }
  ]

  private _getScheduleDetail()
  {
    this.calendarService.getScheduleDetail(this.data).subscribe(
      (response: any) =>
      {
        if (response != null)
        {
          const INITIAL_EVENTS : EventInput[] = [];
          const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); 
          for (let i = 0; i < response.data.listTimeWorkings.length; i++)
          {
            const schedule = response.data.listTimeWorkings[i];
            const event : EventInput = {
              id: ""+schedule.id,
              title: response.data.name,
              start: TODAY_STR + 'T' + schedule.startTime+':00',
              end: TODAY_STR + 'T' + schedule.endTime+':00',
            }
            INITIAL_EVENTS.push(event);
            this.INITIAL_EVENTS = INITIAL_EVENTS;            
          }
        }
      }
    )
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }



}
