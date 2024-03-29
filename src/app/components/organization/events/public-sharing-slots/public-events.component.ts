import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
//Angular Calendar
import { ApiResponse } from 'src/app/_models/response';
import { EventService } from 'src/app/_services/event.service';
import { FormControl } from '@angular/forms';
import { MakePublicShareRequest } from 'src/app/_models/event';
import { MatChipInputEvent } from '@angular/material/chips';
import Utils from 'src/app/_utils/utils';
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
  listEmailsFormControl = new FormControl();
  emails: string[] = [];
  mailCtrl = new FormControl();
  ngOnInit(): void {
    this._getAllExternalSlots();
  }

  _getAllExternalSlots() {
    const currentDate: Date = new Date();
    let lastYearDate: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );

    let nextYearDate: Date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 2,
      currentDate.getDate()
    );
    let isoCurrentDate: string = currentDate.toISOString();
    let isoLastMonthDate: string = lastYearDate.toISOString();
    let isoNextMonthDate: string = nextYearDate.toISOString();
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
      if (selectSharingSlot.length > 0) {
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
        try {
          this.eventService
            .createPublicShare(requestBody)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                const publicShareId: number = response.data.id;
                this.eventService
                  .sharePublicSlots(this.emails, publicShareId)
                  .subscribe((response: any) => {
                    if (response.statusCode === 200) {
                      debugger;
                      this.toastrService.success(
                        'Your slots have been shared successfully',
                        'SUCCESS'
                      );
                    } else {
                      let errorMessage: string = `${response.fieldError} ${response.errorMessage}`;
                      this.toastrService.warning(
                        errorMessage,
                        '',
                        Utils.toastrConfig
                      );
                    }
                  });
              } else {
                let errorMessage: string = `${response.fieldError} ${response.errorMessage}`;
                this.toastrService.warning(
                  errorMessage,
                  '',
                  Utils.toastrConfig
                );
              }
            });
        } catch (error: any) {
          let errorMessage: string = `${error.fieldError} ${error.errorMessage}`;
          this.toastrService.warning(errorMessage, '', Utils.toastrConfig);
        }
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

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.emails.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();

    this.mailCtrl.setValue(null);
  }

  removeChip(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }
}
