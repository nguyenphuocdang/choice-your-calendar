import { Component, OnInit, forwardRef, Optional  } from '@angular/core';
//FullCalendar For Angular 14
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, interactionSettingsStore } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';

//FullCalendar For Angular 13
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from '@fullcalendar/angular'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/_services/calendar.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { ModifyEventComponent } from '../../popup/modify-event/modify-event.component';

const SCHEDULE_API = 'http://localhost:8000/api/schedule';

@Component({
  selector: 'app-active-calendar',
  templateUrl: './active-calendar.component.html',
  styleUrls: ['./active-calendar.component.css']
})
export class ActiveCalendarComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  ACTIVE_EVENTS : EventInput[] = [];
  defaultDate: Date = new Date();
  defaultFromDate : string = this.defaultDate.toISOString().replace(/T.*$/, ''); 
  defaultToDate: string = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), this.defaultDate.getDate()+7).toISOString().replace(/T.*$/, '');
  selectInfo!: DateSelectArg;
  scheduleId!: number;
  // isMenuVisible = false;
  // darkTheme = false;
  // firstDemoLoaded = false;
  // private datePipe!: DatePipe;

  constructor(
    @Optional() private dialog: MatDialog,
    private route: ActivatedRoute,
    private calendarService: CalendarService, 
    private http: HttpClient,
    private storageService: LocalStorageService,
  ) { }

  async ngOnInit(): Promise<void> 
  {


    this.ACTIVE_EVENTS = await this._getActiveCalendar(this.defaultFromDate,this.defaultToDate);
    if ( this.ACTIVE_EVENTS.length > 0)
    {
      debugger
      this.storageService.setActiveCalendar( this.ACTIVE_EVENTS);
      forwardRef(() => Calendar);
      this.calendarOptions = {       
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        events:  this.ACTIVE_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventColor: '#378006',
        select: this.handleDateSelect.bind(this),
        // eventClick: this.handleEventClick.bind(this),
        // eventsSet: this.handleEvents.bind(this)
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      };
    }
    console.log(this.calendarOptions)
  }

  private async _getActiveCalendar(fromDate: string, toDate: string) : Promise<EventInput[]>
  {
    let INITIAL_EVENTS : EventInput[] = [];
    try 
    {
      const activeCalendar: EventInput[] = this.storageService.getActiveCalendar();
      if (activeCalendar != null) 
      {
        INITIAL_EVENTS = activeCalendar;
        this.scheduleId = Number(INITIAL_EVENTS[0].id);
      }
      else 
      {
        const responseActiveCalendar = await this.calendarService.getActiveCalendarUsingPromise(fromDate,toDate);
        if (responseActiveCalendar!=null && responseActiveCalendar.statusMessage == 'Successfully')
        {
          this.scheduleId = responseActiveCalendar.data.scheduleId;
            for (let i = 0; i < (<any>responseActiveCalendar).data.scheduleDatas.length;i++)
            {
              const schedule = (<any>responseActiveCalendar).data.scheduleDatas[i];
              if (schedule.timeDatas.length > 0)
              {
                for (let j = 0 ; j < schedule.timeDatas.length; j ++)
                {
                  const event: EventInput = 
                  {
                    id: ""+(<any>responseActiveCalendar).data.scheduleId,
                    title: schedule.timeDatas[j].title,        
                    start: "" + schedule.day + 'T' + schedule.timeDatas[j].startTime+':00',
                    end: "" + schedule.day +'T' + schedule.timeDatas[j].endTime+':00', 
                  }
                  INITIAL_EVENTS.push(event);
                }
              }
            }
        } 
      }
      return INITIAL_EVENTS;
    } 
    catch (error) 
    {
      //handle error
      debugger
    }
    return INITIAL_EVENTS;
  }

  addMoreEventClick()
  {
    debugger
    const dialogConfig = new MatDialogConfig();
    console.log(this.scheduleId);
    dialogConfig.data = 
    {
      title: 'ADD MORE EVENT',
      scheduleId: this.scheduleId,
      selectInfo: this.selectInfo,
    };
    this.dialog.open(ModifyEventComponent, dialogConfig);
  }

  handleDateSelect(selectInfo: DateSelectArg) 
  {    
    this.selectInfo = selectInfo;


    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent
    //   ({
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }


  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }




  //Add Schedule

  //Add Events



  toggleWeekends() {
    // make a copy while overriding some values
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends,
    }
  }
}
