import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { SingleEventDetail } from 'src/app/_models/event';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import { UserBusinessDetail } from 'src/app/_models/user';
import { EventService } from 'src/app/_services/event.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import { EventDetailComponent } from '../../resources/booking-resources/event-detail/event-detail.component';
@Component({
  selector: 'app-internal-events',
  templateUrl: './internal-events.component.html',
  styleUrls: ['./internal-events.component.scss'],
})
export class InternalEventsComponent implements OnInit {
  upcomingCompanyEvents: SingleEventDetail[] = [];
  previousCompanyEvents: SingleEventDetail[] = [];
  fullCompanyEvents: SingleEventDetail[] = [];
  displayedCompanyEvents: SingleEventDetail[] = [];
  eventHostersList: UserBusinessDetail[] = [];
  participatingEvents: UserBusinessDetail[] = [];
  hostEmail: string = '';
  selectedOption: string = 'upcoming-company-events';
  selectedPeople: string = 'all-hoster';
  isoCurrentDate: string = '';
  isoNextYearDate: string = '';
  isoLastYearDate: string = '';
  constructor(
    private eventService: EventService,
    private organizationService: OrganizationService,
    @Optional() private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._handleTime();
    this._getUpcomingCompanyEvents();
    // this._getPreviousCompanyEvents(true);
    // this._getAllCompanyEvents(true);
    this._getAllUserInOrganization();
  }

  _handleTime() {
    //Current Date
    let currentDate: Date = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let _currentDate: Date = new Date(
      currentDate.getTime() + 7 * 60 * 60 * 1000
    );
    this.isoCurrentDate = _currentDate.toISOString();
    //Last Year Date
    let lastYearDate: Date = new Date(
      _currentDate.getFullYear() - 1,
      _currentDate.getMonth(),
      _currentDate.getDate()
    );
    this.isoLastYearDate = lastYearDate.toISOString();
    //Next Year Date
    let nextYearDate: Date = new Date(
      _currentDate.getFullYear() + 1,
      _currentDate.getMonth(),
      _currentDate.getDate()
    );
    this.isoNextYearDate = nextYearDate.toISOString();
  }
  _getUpcomingCompanyEvents(participantFlag?: boolean) {
    this._getOrganizationEvents(
      this.isoCurrentDate,
      this.isoNextYearDate,
      this.hostEmail,
      participantFlag
    ).subscribe((response: SingleEventDetail[]) => {
      this.displayedCompanyEvents = response;
    });
  }

  _getPreviousCompanyEvents(participantFlag?: boolean) {
    this._getOrganizationEvents(
      this.isoLastYearDate,
      this.isoCurrentDate,
      this.hostEmail,
      participantFlag
    ).subscribe((response: SingleEventDetail[]) => {
      // this.previousCompanyEvents = response;
      this.displayedCompanyEvents = response;
    });
  }

  _getAllCompanyEvents(participantFlag?: boolean) {
    this._getOrganizationEvents(
      this.isoLastYearDate,
      this.isoNextYearDate,
      this.hostEmail
    ).subscribe((response: SingleEventDetail[]) => {
      // this.fullCompanyEvents = response;
      this.displayedCompanyEvents = response;
    });
  }

  _getOrganizationEvents(
    startDate: string,
    endDate: string,
    hostEmail: string,
    participantFlag?: boolean
  ): Observable<SingleEventDetail[]> {
    const listEvents: SingleEventDetail[] = [];
    return this.eventService
      .getAllOrganizationEvents(startDate, endDate, hostEmail)
      .pipe(
        map((response: ApiResponse<SingleEventDetail[]>) => {
          if (response.statusCode === 200) {
            response.data.forEach((element) => {
              const event: SingleEventDetail = new SingleEventDetail(element);
              if (participantFlag) {
                if (event.participantFlag) {
                  listEvents.push(event);
                }
              } else {
                listEvents.push(event);
              }
            });
          } else {
            debugger;
          }
          return listEvents;
        })
      );
  }

  onSelectionChange() {
    if (this.selectedOption === 'upcoming-company-events')
      this._getUpcomingCompanyEvents();
    else if (this.selectedOption === 'personal-upcoming-events')
      this._getUpcomingCompanyEvents(true);
    else if (this.selectedOption === 'personal-previous-events') {
      this._getPreviousCompanyEvents(true);
    } else this._getAllCompanyEvents();
  }

  onSelectionEventHosterChange() {
    if (this.selectedPeople == 'all-hoster') {
      this.hostEmail = '';
    } else {
      this.hostEmail = this.selectedPeople;
    }
    if (this.selectedOption === 'upcoming-company-events')
      this._getUpcomingCompanyEvents();
    else if (this.selectedOption === 'personal-upcoming-events') {
      this._getUpcomingCompanyEvents(true);
    } else if (this.selectedOption === 'personal-previous-events') {
      this._getPreviousCompanyEvents(true);
    } else if (this.selectedOption === 'all-company-events') {
      this._getAllCompanyEvents();
    }
  }

  _getAllUserInOrganization() {
    try {
      this.organizationService
        .getUserInOrganization()
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element) => {
                if (
                  element.fullname != 'User Default' &&
                  element.eventHosterFlag
                ) {
                  this.eventHostersList.push(element);
                }
              });
            } else {
              debugger;
            }
          }
        );
    } catch (error) {
      debugger;
    }
  }

  onViewAndJoinEvent(event: SingleEventDetail, participantFlag: boolean) {
    const dialogRef = this.dialog.open(EventDetailComponent, {
      width: '800px',
      height: 'fit-content',
      data: {
        eventId: event.id,
        participantFlag: participantFlag,
      },
    });
  }
}
