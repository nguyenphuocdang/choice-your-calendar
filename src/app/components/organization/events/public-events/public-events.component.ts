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
import { catchError, from, last, lastValueFrom } from 'rxjs';
import { LocalStorageService } from 'src/app/_services/local-storage.service';

import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';

import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
//Angular Calendar
import { ApiResponse } from 'src/app/_models/response';
import { EventService } from 'src/app/_services/event.service';
import { FormControl } from '@angular/forms';
import { MakePublicShareRequest } from 'src/app/_models/event';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.component.html',
  styleUrls: ['./public-events.component.scss'],
})
export class PublicEventsComponent implements OnInit {
  constructor(
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}
  publicSlots: PublicScheduleData[] = [];
  renderedPublicSlots: PublicScheduleData[] = [];
  listFreeTimeType: string[] = [];
  selecteFreeTimeType = new FormControl('');
  allSelectedSlotFlag: boolean = false;
  listEmails: string[] = [];
  listEmailsFormControl = new FormControl();
  emails: string[] = [];

  ngOnInit(): void {
    this._getAllExternalSlots();
  }

  _getAllExternalSlots() {
    const currentDate: Date = new Date();
    let lastMonthDate: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );

    let nextMonthDate: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate()
    );
    let isoCurrentDate: string = currentDate.toISOString();
    let isoLastMonthDate: string = lastMonthDate.toISOString();
    let isoNextMonthDate: string = nextMonthDate.toISOString();
    this.eventService
      .getAllExternalSlots(isoLastMonthDate, isoNextMonthDate)
      .subscribe((response: ApiResponse<any>) => {
        if (response.statusCode === 200) {
          this.listFreeTimeType = response.data.listFreeTimeType;
          response.data.scheduleDatas.forEach(
            (scheduleData: PublicScheduleData) => {
              if (scheduleData.timeDatas.length > 0) {
                scheduleData.timeDatas.forEach((timeData: PublicTimeData) => {
                  const publicSlotElement: PublicScheduleData =
                    new PublicScheduleData(scheduleData.day, [timeData]);
                  this.publicSlots.push(publicSlotElement);
                });
              }
            }
          );
          this._getFreeTimeTypes();
        }
      });
  }
  _getFreeTimeTypes() {
    if (this.listFreeTimeType.length > 0) {
      this.selecteFreeTimeType.setValue(this.listFreeTimeType[0]);
      this._getExternalSlotsByFreeTimeType(this.selecteFreeTimeType.value!);
    }
  }
  _getExternalSlotsByFreeTimeType(freeTimeType: string) {
    if (this.publicSlots.length > 0) {
      const tempRenderedPublicSlots: PublicScheduleData[] = [];
      this.publicSlots.forEach((element: PublicScheduleData) => {
        if (element.timeDatas[0].freetimeType === freeTimeType)
          tempRenderedPublicSlots.push(element);
      });
      this.renderedPublicSlots = tempRenderedPublicSlots;
    }
  }
  onFreeTimeTypeSelectChange() {
    this._getExternalSlotsByFreeTimeType(this.selecteFreeTimeType.value!);
  }

  selectAllSharingSlot() {
    this.renderedPublicSlots.forEach((slot: PublicScheduleData) => {
      slot.selectFlag = this.allSelectedSlotFlag;
    });
  }

  onSharingSlotClick() {
    const selectSharingSlot: PublicScheduleData[] = [];
    if (this.renderedPublicSlots.length > 0) {
      this.renderedPublicSlots.forEach((publicSlot: PublicScheduleData) => {
        if (publicSlot.selectFlag) selectSharingSlot.push(publicSlot);
      });
      const startTime = this._combineTimeAndDateForRequestType(
        selectSharingSlot[0].day,
        selectSharingSlot[0].timeDatas[0].startTime!
      );
      const endTime = this._combineTimeAndDateForRequestType(
        selectSharingSlot[selectSharingSlot.length - 1].day,
        selectSharingSlot[selectSharingSlot.length - 1].timeDatas[0].endTime!
      );
      const requestBody: MakePublicShareRequest = {
        startTime: startTime,
        endTime: endTime,
        eventDuration: 0,
        eventType: 'Online',
        freeTimeType: this.selecteFreeTimeType.value!,
        publicNewEventFlag: false,
        shareFreeTimeScheduleFlag: true,
        sharePublicEventFlag: false,
      };
      debugger;
      try {
        this.eventService
          .createPublicShare(requestBody)
          .subscribe((response: any) => {
            debugger;
            if (response.statusCode === 200) {
              const publicShareId: number = response.data.id;
              this.eventService
                .sharePublicSlots(this.emails, publicShareId)
                .subscribe((response: any) => {
                  if (response.statusCode === 200) {
                    this.toastrService.success(
                      'Your slots have been shared successfully',
                      'SUCCESS'
                    );
                  }
                });
            } else {
              debugger;
            }
          });
      } catch (error) {
        debugger;
      }
    }
  }

  _combineTimeAndDateForRequestType(dateYYYYMMDD: string, time: string) {
    const combinedString = `${dateYYYYMMDD}T${time}:00.000Z`;
    const combinedDate = new Date(combinedString);
    // const _earlier7hourTime: Date = new Date(
    //   combinedDate.getTime() + 7 * 60 * 60 * 1000
    // );
    const requestTime: string = combinedDate.toISOString();
    return requestTime;
  }

  addChip(chip: string): void {
    if (chip.trim()) {
      this.emails.push(chip.trim());
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.listEmails.push(value);
    }
    event.chipInput!.clear();
    this.listEmailsFormControl.setValue(null);
  }

  remove(email: string): void {
    const index = this.listEmails.indexOf(email);
    if (index >= 0) {
      this.listEmails.splice(index, 1);
    }
  }
}
