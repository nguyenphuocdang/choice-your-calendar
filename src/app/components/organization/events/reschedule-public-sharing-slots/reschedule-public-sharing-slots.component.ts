import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/_models/response';
import { PublicScheduleData, PublicTimeData } from 'src/app/_models/schedule';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-reschedule-public-sharing-slots',
  templateUrl: './reschedule-public-sharing-slots.component.html',
  styleUrls: ['./reschedule-public-sharing-slots.component.scss'],
})
export class ReschedulePublicSharingSlotsComponent implements OnInit {
  eventId: number = 0;
  fromDate: string = '';
  toDate: string = '';
  availableExternalSlots: PublicScheduleData[] = [];
  constructor(
    private Activatedroute: ActivatedRoute,
    private eventService: EventService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.Activatedroute.queryParamMap.subscribe((params) => {
    //   this.eventId = parseInt(params.get('eventId')!);
    //   this.fromDate = params.get('fromDate') ?? '';
    //   this.toDate = params.get('toDate') ?? '';
    // });

    this.fromDate = '2023-06-24 15:00';
    this.toDate = '2023-06-24 17:00';
    this.eventId = 183;
    debugger;
  }

  _getAvailableExternalSlot() {
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
          response.data.scheduleDatas.forEach(
            (scheduleData: PublicScheduleData) => {
              if (scheduleData.timeDatas.length > 0) {
                scheduleData.timeDatas.forEach((timeData: PublicTimeData) => {
                  const publicSlotElement: PublicScheduleData =
                    new PublicScheduleData(scheduleData.day, [timeData]);
                  this.availableExternalSlots.push(publicSlotElement);
                  debugger;
                });
              }
            }
          );
        }
      });
  }
}
