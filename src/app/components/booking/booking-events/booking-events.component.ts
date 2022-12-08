import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetail } from 'src/app/_models/event';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-booking-events',
  templateUrl: './booking-events.component.html',
  styleUrls: ['./booking-events.component.css']
})
export class BookingEventsComponent implements OnInit {
  defaultDate: Date = new Date();
  defaultStartTime: Date = new Date((this.defaultDate.setMonth(this.defaultDate.getMonth()-3)));
  defaultEndTime: Date = new Date((this.defaultDate.setMonth(this.defaultDate.getMonth()+3)));
  defaultPageIndex: number = 0;
  defaultSize: number = 100;
  eventList: EventDetail[] = [];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void 
  {
    this.route.params.subscribe(() => {
      this._searchListEvents(this.defaultStartTime.toISOString(),this.defaultEndTime.toISOString(),this.defaultPageIndex,this.defaultSize)
    })
    console.log(this.eventList);
  }

  _searchListEvents(startTime: string, endTime: string, page: number, size: number)
  {
      this.eventService.searchListEvents(startTime,endTime,page,size).subscribe(
        (response: EventDetail[]) =>
          {
            if (response.length > 0)
            {
              this.eventList = response;
            }
          }
      )

  }

  

}
