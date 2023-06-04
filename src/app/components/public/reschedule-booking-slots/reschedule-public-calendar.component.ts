import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReschedulePublicRequest } from 'src/app/_models/event';
import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
import { EventService } from 'src/app/_services/event.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-reschedule-public-calendar',
  templateUrl: './reschedule-public-calendar.component.html',
  styleUrls: ['./reschedule-public-calendar.component.scss'],
})
export class ReschedulePublicCalendarComponent implements OnInit {
  startTimeControl = new FormControl();
  endTimeControl = new FormControl();
  partnerPathMapping: string = '';
  partnerEmail: string = '';
  shareCode: string = '';
  reason: string = '';
  publicBookingSlots: PublicScheduleData = {
    day: '',
    timeDatas: [],
  };
  bookFlag: boolean = false;
  isOpenTimeSuggestionSidenav: boolean = false;
  selectedDate: Date = new Date();
  displayBookingDate: string = '';
  startTimeArray: string[] = [
    '12 AM',
    '1 AM',
    '2AM',
    '3 AM',
    '4 AM',
    '5 AM',
    '6 AM',
    '7 AM',
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '11 PM',
  ];
  endTimeArray: string[] = [
    '12 AM',
    '1 AM',
    '2AM',
    '3 AM',
    '4 AM',
    '5 AM',
    '6 AM',
    '7 AM',
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '11 PM',
  ];
  constructor(
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.partnerPathMapping = params.get('partnerPathMapping') ?? '';
      this.shareCode = params.get('shareCode') ?? '';
      this.getPublicSlotForReschedule();
    });
  }

  getPublicSlotForReschedule() {
    try {
      this.eventService
        .getPublicSlotsForReschedule(this.partnerPathMapping, this.shareCode)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            response.data.scheduleDatas.forEach((element: any, index: any) => {
              if (element.timeDatas.length > 0) {
                this.publicBookingSlots = element;
              }
            });
            this.displayBookingDate = Utils.convertYYYYMMDDtoDateString(
              this.publicBookingSlots.day
            );
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }

  rescheduleBookingSlot(element: PublicTimeData, index: number) {
    const requestBody: ReschedulePublicRequest = {
      eventDescription: '',
      rescheduleExternalSlotId: element.eventId!,
      pathMappingKey: this.partnerPathMapping,
      shareCode: this.shareCode,
      reason: this.reason,
    };

    try {
      this.eventService
        .rescheduleBookingSlot(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Your event is successfully rescheduled',
              'SUCCESS'
            );
            this.bookFlag = true;
          } else {
            debugger;
            this.toastrService.error(response.errors.errorMessage);
          }
        });
    } catch (error: any) {
      debugger;
    }
  }

  onToggleSidenav() {
    this.isOpenTimeSuggestionSidenav = !this.isOpenTimeSuggestionSidenav;
  }
  onClosdeSidenav() {
    this.isOpenTimeSuggestionSidenav = !this.isOpenTimeSuggestionSidenav;
  }

  onConfirmSuggestTimeReschedule() {
    const requestBody: any = {
      fromDate: this.combineDateAndTime(
        this.selectedDate,
        this.startTimeControl.value!
      ),
      toDate: this.combineDateAndTime(
        this.selectedDate,
        this.endTimeControl.value!
      ),
      pathMappingKey: this.partnerPathMapping,
      shareCode: this.shareCode,
    };
    debugger;
    try {
      this.eventService
        .suggestTimeForRescheduleByPublicPartner(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Your suggesting time have been sent to the host, the result will be sent back to your mail as soon as possible.'
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

  combineDateAndTime(date: Date, time: string): string {
    // Extract the date object
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    // Extract the time string
    let timeParts = time.split(' ');
    let hour = parseInt(timeParts[0]);
    let isPM = timeParts[1].toUpperCase() === 'PM';
    if (isPM && hour !== 12) {
      hour += 12; // Convert to 24-hour format
    } else if (!isPM && hour === 12) {
      hour = 0; // Midnight (12 AM) in 24-hour format
    }
    let minutes = 0; // Assuming the provided time is only in hours, no minutes
    let seconds = 0; // Assuming the provided time is only in hours, no seconds
    // Create the UTC string
    let utcString = `${year}-${month}-${day}T${hour
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.000Z`;
    return utcString;
  }
}
