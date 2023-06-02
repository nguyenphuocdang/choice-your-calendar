import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SingleEventDetail } from 'src/app/_models/event';
import { DeviceOfEvent } from 'src/app/_models/resource';
import { ApiResponse } from 'src/app/_models/response';
import { UserOfEvent, UserProfile } from 'src/app/_models/user';
import { EventService } from 'src/app/_services/event.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  @Output() triggerEvent = new EventEmitter<SingleEventDetail>();
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
  roomList: DeviceOfEvent[] = [];
  deviceList: DeviceOfEvent[] = [];
  userList: UserOfEvent[] = [];
  displayLocation: string = '';
  displayParticipants: string = '';
  participantFlag: boolean = false;
  eventHoster: UserOfEvent = {
    id: 0,
    fullname: '',
    email: '',
    hostEventFlag: false,
  };
  constructor(
    public dialogRef: MatDialogRef<EventDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventService: EventService,
    private storageService: LocalStorageService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.eventId = this.data.eventId;
    this.participantFlag = this.data.participantFlag ?? false;
    this._getEventDetail(this.eventId);
    this._getDevicesInEvent(this.eventId);
    this._getUserInEvent(this.eventId);
  }
  _getEventDetail(eventId: number) {
    try {
      this.eventService
        .getEventDetail(eventId)
        .subscribe((response: ApiResponse<SingleEventDetail>) => {
          if (response.statusCode === 200) {
            this.eventInformation = new SingleEventDetail(response.data);
            debugger;
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }
  _getDevicesInEvent(eventId: number) {
    try {
      this.eventService
        .getAllDeviceInYourEvent(eventId)
        .subscribe((response: ApiResponse<DeviceOfEvent[]>) => {
          if (response.statusCode === 200) {
            this.roomList = [];
            this.deviceList = [];
            response.data.forEach((element) => {
              if (element.deviceType === 'ROOM') this.roomList.push(element);
              else this.deviceList.push(element);
            });
            this.displayLocation = this.roomList
              .map((element) => element.name)
              .join(', ');
            this.eventInformation.location = this.displayLocation;
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }
  _getUserInEvent(eventId: number) {
    try {
      this.eventService
        .getAllUserInYourEvent(eventId)
        .subscribe((response: ApiResponse<UserOfEvent[]>) => {
          if (response.statusCode === 200) {
            this.userList = [];
            response.data.forEach((element) => {
              if (element.hostEventFlag) this.eventHoster = element;
              else this.userList.push(element);
            });
            // this.displayParticipants = this.userList
            //   .map((element) => element.fullname)
            //   .join(', ');
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }
  closeComponent() {
    this.dialogRef.close();
  }

  joinOrganizationEvent() {
    const user: UserProfile = this.storageService.getUserProfile();
    const email: string = user.email ?? '';
    const listEmailJoining: string[] = [email];
    try {
      this.eventService
        .joinOrganizationEvent(this.eventId, listEmailJoining)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Joining Event Successfully',
              'SUCCESS',
              Utils.toastrConfig
            );
            this.participantFlag = true;
          } else {
            debugger;
            this.toastrService.error(
              response.errors.errorMessage,
              'ERROR',
              Utils.toastrConfig
            );
          }
        });
    } catch (error) {
      debugger;
    }
  }

  onClickReschedulingEvent() {
    this.triggerEvent.emit(this.eventInformation);
    this.dialogRef.close();
  }
}
