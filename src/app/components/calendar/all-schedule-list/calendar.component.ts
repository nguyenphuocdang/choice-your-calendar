import {
  Component,
  OnInit,
  forwardRef,
  Optional,
  ViewChild,
} from '@angular/core';
//FullCalendar For Angular 14
// import { CalendarOptions, defineFullCalendarElement } from '@fullcalendar/web-component';
import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';

//FullCalendar For Angular 13
import {
  CalendarOptions,
  EventApi,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateScheduleComponent } from '../create-schedule/create-schedule.component';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/_services/calendar.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DetailScheduleComponent } from '../detail-schedule/detail-schedule.component';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pagination } from 'src/app/_models/pagination';
import { ScheduleResponse } from 'src/app/_models/schedule';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'name',
    'brief',
    'view',
    'status',
    'startDate',
    'endDate',
  ];
  @ViewChild(MatTable) table!: MatTable<Schedule>;
  //datasource of Angular Material Table
  public dataSource!: MatTableDataSource<Schedule>;
  private dataArray: any;
  pagination!: Pagination;
  pageNumber = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10];
  totalElements: number = 0;

  calendarOptions!: CalendarOptions;
  isMenuVisible = false;
  darkTheme = false;
  firstDemoLoaded = false;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Optional() private dialog: MatDialog,
    private route: ActivatedRoute,
    private calendarService: CalendarService
  ) {}
  currentEvents: EventApi[] = [];
  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this._getSchedulePagination(this.pageNumber, this.pageSize);
    });
  }

  // ngAfterViewInit()
  // {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  private _getSchedules() {
    this.calendarService.getListSchedules().subscribe((response: any) => {
      const listSchedule: Schedule[] = [];
      if (
        response != null &&
        response.data != null &&
        response.statusCode == 200
      ) {
        for (let i = 0; i < response.data.content.length; i++) {
          const schedulesElement = response.data.content[i];
          const schedule: Schedule = {
            id: schedulesElement.id,
            name: schedulesElement.name,
            brief: schedulesElement.brief,
            listTimeWorkings: schedulesElement.listTimeWorkings,
          };
          listSchedule.push(schedule);
        }
        this.dataArray = listSchedule;
        this.dataSource = new MatTableDataSource<Schedule>(this.dataArray);
      }
    });
  }

  private _getSchedulePagination(page: number, size: number) {
    this.calendarService
      .getListSchedulesPagination(page, size)
      .subscribe((response: any) => {
        this.totalElements = response.pagination.totalElements;
        const listSchedule: ScheduleResponse[] = [];
        if (response.pagination != null && response.result != null) {
          for (let i = 0; i < response.result.length; i++) {
            const schedulesElement = response.result[i];
            const schedule: ScheduleResponse = {
              id: schedulesElement.id,
              name: schedulesElement.name,
              brief: schedulesElement.brief,
              listTimeWorkings: schedulesElement.listTimeWorkings,
              active: '',
              effectiveDate: schedulesElement.effectiveDate ?? '',
              expiriedDate: schedulesElement.expiriedDate ?? '',
            };
            schedule.active =
              schedulesElement.active == true
                ? 'In Active'
                : 'No Longer In Use';
            listSchedule.push(schedule);
          }
          this.dataArray = listSchedule;
          this.dataSource = new MatTableDataSource<Schedule>(this.dataArray);
        }
      });
  }

  onChangedPage(pageData: PageEvent) {
    this._getSchedulePagination(pageData.pageIndex, pageData.pageSize);
  }

  onCreateSchedulePopup() {
    const dialogRef = this.dialog.open(CreateScheduleComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result.isCreatedSuccessfully && result.newSchedule != null) {
          this.dataArray.push(result.newSchedule);
          this.dataSource = new MatTableDataSource<Schedule>(this.dataArray);
        }
      }
    });
  }

  viewScheduleDetail(elementId: any) {
    const INITIAL_EVENTS: EventInput[] = [];
    this.calendarService
      .getScheduleDetail(elementId)
      .subscribe((response: any) => {
        if (response != null) {
          const TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
          for (let i = 0; i < response.data.listTimeWorkings.length; i++) {
            const schedule = response.data.listTimeWorkings[i];
            const event: EventInput = {
              id: '' + schedule.id,
              title: response.data.name,
              start: '2022-11-21' + 'T' + schedule.startTime + ':00',
              end: '2022-11-21' + 'T' + schedule.endTime + ':00',
            };
            INITIAL_EVENTS.push(event);
          }

          const dialogRef = this.dialog.open(DetailScheduleComponent, {
            data: INITIAL_EVENTS,
          });
        }
      });
  }
}

export class Schedule {
  id!: number;
  name!: string;
  brief!: string;
  listTimeWorkings!: TimeWorkingData[];
}

class TimeWorkingData {
  id!: number;
  startTime!: string;
  endTime!: string;
  weekday!: string;
}
