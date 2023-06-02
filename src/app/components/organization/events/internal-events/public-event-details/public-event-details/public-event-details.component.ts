import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleEventDetail } from 'src/app/_models/event';
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
  eventId: number = 0;
  cexternalFlag: boolean = false;
  eventInformation: SingleEventDetail = {
    id: 0,
    eventName: '',
    eventDescription: '',
    appointmentUrl: '',
    eventStatus: '',
    startTime: '',
    endTime: '',
    sendEmailFlag: false,
    numberOfParticipants: 0,
    publicModeFlag: false,
    eventHosterId: 0,
    date: '',
  };
  participantFlag: boolean = false;
  emails: string[] = [];
  constructor(
    private Activatedroute: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.partnerPathMapping = params.get('partnerPathMapping') ?? '';
      this.shareCode = params.get('shareCode') ?? '';
      this._getPublicEventDetail();
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
            this.eventInformation = new SingleEventDetail(response.data);
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }

  onRedirectReschedule() {
    const queryParams = this.Activatedroute.snapshot.queryParams;
    this.router.navigate(['/public-event/reschedule-event'], {
      queryParams,
    });
  }
}
