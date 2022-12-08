import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SharedCalendarDetails } from 'src/app/_models/event';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-private-calendar',
  templateUrl: './private-calendar.component.html',
  styleUrls: ['./private-calendar.component.css']
})
export class PrivateCalendarComponent implements OnInit {

  defaultSize: number = 100;
  sharedCalendars: SharedCalendarDetails[] = [];
  hasNoData: boolean = false;
  selectedCalendar: SharedCalendarDetails = {
    id: 0,
    ownerNotifyEmail: '',
    title: '',
    notifyImageLink: '',
    notifyLink: '',
    notifyDate: '',
    seenFlag: false
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void 
  {
    this.route.params.subscribe(
      () => {
        this._getSharedCalendar(this.defaultSize);
      }
    )

    this.eventService.$selectedNotification.subscribe(
      (data:SharedCalendarDetails) => {
        this.selectedCalendar = data;
      }
    ) 
  }

  _getSharedCalendar(size: number)
  {
    this.eventService.getListOfSharedCalendars(size).subscribe(
      (response: SharedCalendarDetails[]) => 
      {
        if (response.length > 0)
        {
          this.sharedCalendars = response;
          this.eventService.updateNotification(this.sharedCalendars[0]);
        }
        else 
        {
          this.hasNoData = true;
        }
      }
    )
  }

  onClickNotification(index: number)
  {
    this.eventService.updateNotification(this.sharedCalendars[index]);
  }

}
