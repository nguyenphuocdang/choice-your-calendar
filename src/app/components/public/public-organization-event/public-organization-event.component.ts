import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SingleEventDetail } from 'src/app/_models/event';
import { EventService } from 'src/app/_services/event.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-public-organization-event',
  templateUrl: './public-organization-event.component.html',
  styleUrls: ['./public-organization-event.component.scss'],
})
export class PublicOrganizationEventComponent implements OnInit {
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
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParamMap.subscribe((params) => {
      this.partnerPathMapping = params.get('partnerPathMapping') ?? '';
      this.shareCode = params.get('shareCode') ?? '';
      this._getEventDetail();
    });
  }

  _getEventDetail() {
    try {
      this.eventService
        .getPublicEventDetailByPublicPartner(
          this.partnerPathMapping,
          this.shareCode
        )
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.eventInformation = new SingleEventDetail(response.data);
          } else {
          }
        });
    } catch (error: any) {
      debugger;
    }
  }

  onClickJoinPublicEventByPartner() {
    const requestBody: any = {
      eventId: this.eventInformation.id,
      listEmailJoining: [this.partnerEmail],
      pathMappingKey: this.partnerPathMapping,
      shareCode: this.shareCode,
      singleEventFlag: true,
    };
    try {
      this.eventService
        .joinPublicEventByPublicPartner(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success('Your event is ready to go', 'SUCCESS');
            this.participantFlag = true;
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
}
