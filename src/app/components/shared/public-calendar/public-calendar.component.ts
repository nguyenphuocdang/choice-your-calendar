import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import { ToastrService } from 'ngx-toastr';
import { BookPublicRequest, EventCreateRequest } from 'src/app/_models/event';
import {
  FreeTimeScheduleSlots,
  ListTimeWorkingDatas,
  PublicScheduleData,
  PublicTimeData,
} from 'src/app/_models/schedule';
import { CalendarService } from 'src/app/_services/calendar.service';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { PopupService } from 'src/app/_services/popup.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-public-calendar',
  templateUrl: './public-calendar.component.html',
  styleUrls: ['./public-calendar.component.scss'],
})
export class PublicCalendarComponent implements OnInit {
  partnerEmail: string = '';
  partnerPathMapping: string = '';
  shareCode: string = 'oOP7CL8VCrJHZ2gxAl3Y0g==';
  publicBookingSlots: PublicScheduleData = {
    day: '2023-05-29',
    timeDatas: [
      // {
      //   eventId: 91,
      //   freetimeType: 'Interview SEO',
      //   startTime: '09:00',
      //   endTime: '09:30',
      // },
      // {
      //   eventId: 92,
      //   freetimeType: 'Interview SEO',
      //   startTime: '10:00',
      //   endTime: '10:30',
      // },
      // {
      //   eventId: 93,
      //   freetimeType: 'Interview SEO',
      //   startTime: '10:00',
      //   endTime: '10:30',
      // },
      // {
      //   eventId: 94,
      //   freetimeType: 'Interview SEO',
      //   startTime: '11:00',
      //   endTime: '11:30',
      // },
    ],
  };

  constructor(
    @Optional() private dialog: MatDialog,
    private Activatedroute: ActivatedRoute,
    private calendarService: CalendarService,
    private eventService: EventService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.partnerPathMapping = params.get('partnerPathMapping') ?? '';
      // this.shareCode = params.get('shareCode') ?? '';
      this._getPublicShareInfo();
    });
  }

  _getPublicShareInfo() {
    try {
      this.eventService
        .getPublicShareInfo(this.partnerPathMapping, this.shareCode)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.eventService
              .getPublicScheduleCalendarInfo(
                this.partnerPathMapping,
                this.shareCode
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  response.data.scheduleDatas.forEach(
                    (element: any, index: any) => {
                      if (element.timeDatas.length > 0) {
                        this.publicBookingSlots = element;
                      }
                    }
                  );
                  debugger;
                }
              });
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }

  onClickJoinPublicEventBookingSlot(element: PublicTimeData) {
    const requestBody: BookPublicRequest = {
      eventDescription: '',
      eventExternalSlotId: element.eventId,
      eventName: element.freetimeType ?? '',
      listPartnerEmail: [this.partnerEmail],
      location: '',
      pathMappingKey: this.partnerPathMapping,
      shareCode: this.shareCode,
    };
    debugger;
    this.joinPublicEventBookingSlot(requestBody);
  }
  joinPublicEventBookingSlot(requestBody: BookPublicRequest) {
    debugger;
    try {
      this.eventService
        .confirmBookingPublicSlot(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            debugger;
            this.toastrService.success('Booking slot successfully', 'SUCCESS');
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
