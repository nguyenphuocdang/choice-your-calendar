import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventInput } from '@fullcalendar/core';
import { ToastrService } from 'ngx-toastr';
import { BookPublicRequest, EventCreateRequest } from 'src/app/_models/event';
import {
  CustomPublicTimeData,
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
  shareCode: string = '';
  publicBookingSlots: CustomPublicTimeData[] = [];
  bookFlag: boolean = false;
  bookDay: string = '';
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
      this.shareCode = params.get('shareCode') ?? '';
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
                        element.timeDatas.forEach((timeData: any) => {
                          const newPublicSlot: CustomPublicTimeData =
                            new CustomPublicTimeData(element.day, timeData);
                          this.publicBookingSlots.push(newPublicSlot);
                        });
                      }
                    }
                  );
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

  onClickJoinPublicEventBookingSlot(element: PublicTimeData, index: number) {
    const requestBody: BookPublicRequest = {
      eventDescription: '',
      eventExternalSlotId: element.eventId!,
      eventName: element.freetimeType ?? '',
      listPartnerEmail: [this.partnerEmail],
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
            this.bookFlag = true;
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

  _combineTimeAndDateForRequestType(dateYYYYMMDD: string, time: string) {
    const combinedString = `${dateYYYYMMDD}T${time}:00.000Z`;
    const combinedDate = new Date(combinedString);
    const requestTime: string = combinedDate.toISOString();
    return requestTime;
  }
}
