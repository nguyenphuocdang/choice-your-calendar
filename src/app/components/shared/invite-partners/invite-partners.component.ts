import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import { ToastrService } from 'ngx-toastr';
import { elementAt } from 'rxjs';
import {
  FreeTimeScheduleSlots,
  ListTimeWorkingDatas,
  ShareScheduleRequest,
} from 'src/app/_models/schedule';
import { CalendarService } from 'src/app/_services/calendar.service';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { PopupService } from 'src/app/_services/popup.service';
import Utils from 'src/app/_utils/utils';
import { PublicPopupComponent } from '../../popup/public-popup/public-popup.component';

@Component({
  selector: 'app-invite-partners',
  templateUrl: './invite-partners.component.html',
  styleUrls: ['./invite-partners.component.css'],
})
export class InvitePartnersComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  @Input() emailAccount: string = '';
  partnerEmails: string[] = ['', ''];
  partnerEmail: string = '';
  description: string = 'Sharing Calendar';
  @Input() status: string = 'Not Public';
  startAvailableDate: string = '';
  endAvailableDate: string = '';
  duration: string = '';
  freeScheduleId!: number;
  freeTimeScheduleSlots: FreeTimeScheduleSlots = {
    name: '',
    brief: '',
    freeScheduleFlag: true,
    listTimeWorkingDatas: [],
  };
  defaultDate: Date = new Date();
  defaultFromDate: string = this.defaultDate.toISOString().replace(/T.*$/, '');
  defaultToDate: string = new Date(
    this.defaultDate.getFullYear(),
    this.defaultDate.getMonth(),
    this.defaultDate.getDate() + 12
  )
    .toISOString()
    .replace(/T.*$/, '');
  constructor(
    private storageService: LocalStorageService,
    private dialog: MatDialog,
    private eventService: EventService,
    private toastrService: ToastrService,
    private popupService: PopupService,
    private calendarService: CalendarService
  ) {}

  async ngOnInit(): Promise<void> {
    this.emailAccount = this.storageService.getEmail();
    this._getFreeTimeSchedules(this.defaultFromDate, this.defaultToDate, true);
  }

  openPublicCalendarPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      title: 'PUBLIC YOUR CALENDAR',
    };
    this.dialog.open(PublicPopupComponent, dialogConfig);
  }

  onClickShareCalendar() {
    this.popupService.confirmPopup(this.dialog, Utils.confirmShare);
    this.popupService.$isConfirm.subscribe((isConfirm) => {
      if (this.popupService.isConfirm) {
        console.log('Ready to share');
        this._sharedCalendar();
        this.popupService.isConfirm = false;
      }
    });
  }

  _sharedCalendar() {
    let partnerEmailTemp: string[] = this.partnerEmails;
    partnerEmailTemp.forEach((element, index) => {
      if (element == '') {
        partnerEmailTemp.splice(index, 1);
      }
    });

    let fromDate: string = new Date(
      this.defaultDate.getFullYear(),
      this.defaultDate.getMonth(),
      this.defaultDate.getDate() + 2
    )
      .toISOString()
      .replace(/T.*$/, '');
    let toDate: string = new Date(
      this.defaultDate.getFullYear(),
      this.defaultDate.getMonth(),
      this.defaultDate.getDate() + 12
    )
      .toISOString()
      .replace(/T.*$/, '');

    let _convertSelectedDateStart: Date = new Date(fromDate);
    let _convertSelectedDateEnd: Date = new Date(toDate);
    let _convertSelectedStartUTC: string =
      _convertSelectedDateStart.toISOString();
    let _convertSelectedEndUTC: string = _convertSelectedDateEnd.toISOString();

    let data: ShareScheduleRequest = {
      endAvailabelDate: _convertSelectedEndUTC,
      listPartnerEmail: partnerEmailTemp,
      startAvailableDate: _convertSelectedStartUTC,
      duration: this.duration,
    };

    // data.startAvailableDate = _convertSelectedStartUTC;
    // data.endAvailabelDate = _convertSelectedEndUTC;

    this.eventService.shareCalendar(data).subscribe(
      (response: any) => {
        if (response == true) {
          this.toastrService.success('Share Calendar successfully', 'Success');
        } else {
          this.toastrService.error('Share Calendar Got Error', 'Error');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async _getFreeTimeSchedules(
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ) {
    try {
      const response: any = await this.calendarService.getFreeTimeSlotsPromise(
        fromDate,
        toDate,
        freeScheduleFlag
      );
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        this.freeScheduleId = response.data.scheduleId;

        for (let i = 0; i < (<any>response).data.scheduleDatas.length; i++) {
          const schedule = (<any>response).data.scheduleDatas[i];
          if (schedule.timeDatas.length > 0) {
            for (let j = 0; j < schedule.timeDatas.length; j++) {
              const freeSlots: ListTimeWorkingDatas = {
                startTime: schedule.timeDatas[j].startTime,
                endTime: schedule.timeDatas[j].endTime,
                weekday: schedule.day,
                title: '',
              };
              freeSlots.weekday = freeSlots.weekday
                .split('-')
                .reverse()
                .join('-');
              this.freeTimeScheduleSlots.listTimeWorkingDatas.push(freeSlots);
            }
          }
        }
        debugger;
      }
    } catch (error) {
      //handle error
    }
  }
}
