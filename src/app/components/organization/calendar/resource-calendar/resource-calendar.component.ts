import { Component, Inject, OnInit, Optional } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
//Google Authen
import Utils from 'src/app/_utils/utils';
import { ScheduleDatas, TimeData } from 'src/app/_models/schedule';
//Angular Calendar
import { CalendarEvent } from 'angular-calendar';
import { CalendarMonthViewDay } from 'angular-calendar';
import { CalendarView } from 'angular-calendar';
import { ApiResponse } from 'src/app/_models/response';
import { OrganizationService } from 'src/app/_services/organization.service';

@Component({
  selector: 'app-resource-calendar',
  templateUrl: './resource-calendar.component.html',
  styleUrls: ['./resource-calendar.component.scss'],
})
export class ResourceCalendarComponent implements OnInit {
  id: number = 0;
  resourceType: string = '';
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

  constructor(
    public dialogRef: MatDialogRef<ResourceCalendarComponent>,
    private toastrService: ToastrService,
    private organizationService: OrganizationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.id = this.data.id ?? '';
    this.resourceType = this.data.resourceType ?? '';
    this._getResourceActiveCalendar();
  }

  private _getResourceActiveCalendar() {
    try {
      const freeScheduleFlag: boolean = false;
      const today: Date = new Date();
      const currentMonth: number = today.getMonth() + 1;
      const currentYear: number = today.getFullYear();
      const _firstDayOfLastMonth: string = this._convertYYYYMMDD(
        1,
        currentMonth - 1,
        currentYear
      );
      const _firstDayOfNextMonth: string = this._convertYYYYMMDD(
        1,
        currentMonth + 1,
        currentYear
      );

      this.organizationService
        .viewActiveCalendar(
          this.id,
          freeScheduleFlag,
          _firstDayOfLastMonth,
          _firstDayOfNextMonth,
          this.resourceType
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
                    if (this.resourceType === 'user') {
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
                    } else if (this.resourceType === 'device') {
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
  closeComponent() {
    this.dialogRef.close();
  }
}
