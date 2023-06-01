import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-public-event-details',
  templateUrl: './public-event-details.component.html',
  styleUrls: ['./public-event-details.component.scss'],
})
export class PublicEventDetailsComponent implements OnInit {
  partnerEmail: string = '';
  partnerPathMapping: string = '';
  shareCode: string = '';
  constructor(
    private Activatedroute: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.partnerPathMapping = params.get('partnerPathMapping') ?? '';
      this.shareCode = params.get('shareCode') ?? '';
      debugger;
    });
  }

  _getPublicEventDetail() {
    try {
      this.eventService
        .getPublicEventDetailByPublicPartner(
          this.partnerPathMapping,
          this.shareCode
        )
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            debugger;
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
