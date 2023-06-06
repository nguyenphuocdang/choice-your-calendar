import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SingleEventDetail } from 'src/app/_models/event';
import { ApiResponse } from 'src/app/_models/response';
import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
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
  publicSlots: PublicScheduleData[] = [];
  renderedPublicSlots: PublicScheduleData[] = [];
  listFreeTimeType: string[] = [];
  selecteFreeTimeType = new FormControl('');
  allSelectedSlotFlag: boolean = false;
  listEmailsFormControl = new FormControl();
  emails: string[] = [];
  mailCtrl = new FormControl();
  constructor(
    private Activatedroute: ActivatedRoute,
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.eventId = parseInt(params.get('eventId')!);
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

      // this.fromDate = '2023-07-04T07:00:00.000Z';
      // this.toDate = '2023-07-04T18:00:00.000Z';
    });

    this._getAvailableExternalSlot();
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

  selectAllSharingSlot() {
    this.availableExternalSlots.forEach((slot: PublicScheduleData) => {
      slot.selectFlag = this.allSelectedSlotFlag;
    });
  }

  onFreeTimeTypeSelectChange() {
    this._getExternalSlotsByFreeTimeType(this.selecteFreeTimeType.value!);
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

  onClickConfirmRescheduleAvailableExternalSlots() {}
}
