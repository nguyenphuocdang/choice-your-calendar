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
      let date: Date = new Date();
      date.setMonth(date.getMonth() + 3);
      let defaultStartTime: Date = new Date(date);

      this._searchListEvents(defaultStartTime.toISOString(),this.defaultEndTime.toISOString(),this.defaultPageIndex,this.defaultSize)
    })
    console.log(this.eventList);
  }

  _searchListEvents(startTime: string, endTime: string, page: number, size: number)
  {
    debugger
      this.eventService.searchListEvents('2022-09-01T06:49:24.184Z','2022-12-31T06:49:24.184Z',page,size).subscribe(
        (response: EventDetail[]) =>
          {
            if (response.length > 0)
            {
              this.eventList = response;
              console.log(this.eventList);
            }
          }
      )

  }

  

}
