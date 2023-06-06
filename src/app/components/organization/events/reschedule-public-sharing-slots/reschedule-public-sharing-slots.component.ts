import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  MakePublicShareRequest,
  SingleEventDetail,
} from 'src/app/_models/event';
import { ApiResponse } from 'src/app/_models/response';
import {
  BookingSlot,
  PublicBookingSlot,
  PublicScheduleData,
  PublicTimeData,
  TimeData,
} from 'src/app/_models/schedule';
import { EventService } from 'src/app/_services/event.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-reschedule-public-sharing-slots',
  templateUrl: './reschedule-public-sharing-slots.component.html',
  styleUrls: ['./reschedule-public-sharing-slots.component.scss'],
})
export class ReschedulePublicSharingSlotsComponent implements OnInit {
  eventId: number = 0;
  fromDate: string = '';
  toDate: string = '';
  displayStartDate: string = '';
  displayEndDate: string = '';
  availableExternalSlots: PublicScheduleData[] = [];
  eventInformation: SingleEventDetail = {
    id: 0,
    eventName: '',
    eventDescription: '',
    appointmentUrl: '',
    eventStatus: '',
    startTime: '',
    endTime: '',
    sendEmailFlag: false,
    numberOfParticipants: 0,
    publicModeFlag: false,
    eventHosterId: 0,
    date: '',
  };
  listFreeTimeType: string[] = [];
  selecteFreeTimeType = new FormControl('');
  allSelectedSlotFlag: boolean = false;
  listEmailsFormControl = new FormControl();

  bookingSlots: BookingSlot[] = [];
  selectedPublicBookingSlots: PublicBookingSlot[] = [];

  constructor(
    private Activatedroute: ActivatedRoute,
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.eventId = parseInt(params.get('eventId')!);
      this._getEventDetail(this.eventId);
      this.fromDate = params.get('fromDate') ?? '';
      this.toDate = params.get('toDate') ?? '';
      this.displayStartDate = `${Utils.convertYYYYMMDDtoDateString(
        this.fromDate
      )} at ${this.convertDateQueryParamReturnTime(this.fromDate)}`;
      this.displayEndDate = `${Utils.convertYYYYMMDDtoDateString(
        this.toDate
      )} at ${this.convertDateQueryParamReturnTime(this.toDate)}`;
      this.fromDate = this.convertDateQueryParam(this.fromDate);
      this.toDate = this.convertDateQueryParam(this.toDate);
    });
    this._getAvailableExternalSlot();
    this._getAvailableBookingSlot();
  }

  convertDateQueryParam(dateStr: string) {
    const [date, time] = dateStr.split(' ');
    return `${date}T${time}:00`;
  }

  convertDateQueryParamReturnTime(dateStr: string) {
    const [date, time] = dateStr.split(' ');
    return `${time}`;
  }

  _getAvailableExternalSlot() {
    try {
      this.eventService
        .getAllExternalSlots(this.fromDate, this.toDate)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            response.data.scheduleDatas.forEach(
              (scheduleData: PublicScheduleData) => {
                if (scheduleData.timeDatas.length > 0) {
                  scheduleData.timeDatas.forEach((timeData: PublicTimeData) => {
                    const publicSlotElement: PublicScheduleData =
                      new PublicScheduleData(scheduleData.day, [timeData]);
                    this.availableExternalSlots.push(publicSlotElement);
                  });
                }
              }
            );
          } else {
            let errorMessage: string = `${response.fieldError} ${response.errorMessage}`;
            this.toastrService.warning(errorMessage, '', Utils.toastrConfig);
          }
        });
    } catch (error: any) {
      let errorMessage: string = `${error.fieldError} ${error.errorMessage}`;
      this.toastrService.warning(errorMessage, '', Utils.toastrConfig);
    }
  }

  _getAvailableBookingSlot() {
    try {
      this.eventService
        .getSlotsForReschedule(this.fromDate, this.toDate, this.eventId)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            const tempBookingSlots: BookingSlot[] = [];
            response.data.scheduleDatas[0].timeDatas.forEach(
              (element: TimeData) => {
                const bookingSlot: BookingSlot = {
                  selectFlag: false,
                  timeDatas: element,
                };
                tempBookingSlots.push(bookingSlot);
              }
            );
            this.bookingSlots = tempBookingSlots;
          } else {
            let errorMessage: string = `${response.fieldError} ${response.errorMessage}`;
            this.toastrService.warning(errorMessage, '', Utils.toastrConfig);
          }
        });
    } catch (error: any) {
      let errorMessage: string = `${error.fieldError} ${error.errorMessage}`;
      this.toastrService.warning(errorMessage, '', Utils.toastrConfig);
    }
  }

  _getEventDetail(eventId: number) {
    try {
      this.eventService
        .getEventDetail(eventId)
        .subscribe((response: ApiResponse<SingleEventDetail>) => {
          if (response.statusCode === 200) {
            this.eventInformation = new SingleEventDetail(response.data);
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }

  selectAllSharingSlot() {
    this.availableExternalSlots.forEach((slot: PublicScheduleData) => {
      slot.selectFlag = this.allSelectedSlotFlag;
    });
  }

  onClickConfirmRescheduleAvailableExternalSlots() {
    const selectSharingSlot: PublicScheduleData[] = [];
    if (this.availableExternalSlots.length > 0) {
      this.availableExternalSlots.forEach((publicSlot: any) => {
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
          freeTimeType: this.eventInformation.eventName,
          publicNewEventFlag: false,
          shareFreeTimeScheduleFlag: true,
          sharePublicEventFlag: false,
        };
        debugger;
        try {
          this.eventService
            .createPublicShare(requestBody)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                const publicShareId: number = response.data.id;
                this.eventService
                  .reschedulePublicSharingSlot(this.eventId, '', publicShareId)
                  .subscribe((response: any) => {
                    if (response.statusCode === 200) {
                      debugger;
                      this.toastrService.success(
                        'Your slots have been re-shared successfully',
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

  _combineTimeAndDateForRequestTypeAdvanced(time: string, date: Date): string {
    const [hours, minutes] = time.split(':');
    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Number(hours),
      Number(minutes)
    );
    const _earlier7hourTime: Date = new Date(
      combinedDate.getTime() + 7 * 60 * 60 * 1000
    );
    const requestStartTime: string = _earlier7hourTime.toISOString();
    return requestStartTime;
  }

  onSelectPublicBookingSlotClicked(index: number) {
    if (this.bookingSlots[index].selectFlag) {
      this.bookingSlots[index].selectFlag = false;
      const findIndex: number = this.selectedPublicBookingSlots.findIndex(
        (item) => item.timeDatas === this.bookingSlots[index].timeDatas
      );
      this.selectedPublicBookingSlots.splice(findIndex, 1);
    } else {
      this.bookingSlots[index].selectFlag = true;
      const newPublicSlot: PublicBookingSlot = {
        selectFlag: true,
        timeDatas: this.bookingSlots[index].timeDatas,
        date: new Date(this.fromDate),
      };
      this.selectedPublicBookingSlots.push(newPublicSlot);
    }
  }

  onClickConfirmRescheduleAvailableBookingSlots() {
    this.selectedPublicBookingSlots.forEach((slot, index) => {
      const startTime: string = this._combineTimeAndDateForRequestTypeAdvanced(
        slot.timeDatas.startTime,
        slot.date
      );
      const endTime: string = this._combineTimeAndDateForRequestTypeAdvanced(
        slot.timeDatas.endTime,
        slot.date
      );
      debugger;
    });
  }
}
