import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReschedulePublicRequest } from 'src/app/_models/event';
import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-reschedule-public-calendar',
  templateUrl: './reschedule-public-calendar.component.html',
  styleUrls: ['./reschedule-public-calendar.component.scss'],
})
export class ReschedulePublicCalendarComponent implements OnInit {
  partnerPathMapping: string = '';
  partnerEmail: string = '';
  shareCode: string = '';
  reason: string = '';
  publicBookingSlots: PublicScheduleData = {
    day: '',
    timeDatas: [],
  };
  bookFlag: boolean = false;
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
            debugger;
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
          debugger;
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
}
