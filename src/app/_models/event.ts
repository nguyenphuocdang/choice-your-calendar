import Utils from '../_utils/utils';
import { BookingResourcesComponent } from '../components/organization/booking-resources/booking-resources.component';
import { DeviceOfEvent } from './resource';

export class EventSearchRequest {
  endTime!: string;
  eventDescription!: string;
  eventName!: string;
  hostName!: string;
  partnerName!: string;
  startTime!: string;
  searchUserEmail?: string;
}
export class EventDetail {
  id!: number;
  hostFlag!: boolean;
  hostName?: string;
  partnerName?: string;
  organizationName?: string;
  eventName!: string;
  date?: string;
  time?: string;
  startTime?: any;
  endTime?: any;
  eventStatus!: string;
  sendEmailFlag!: boolean;
  publicModeFlag!: boolean;
  cexternalEventFlag!: boolean;
  appointmentUrl?: string;
  reason?: string;
  constructor(data?: any) {
    this.id = data?.id;
    this.hostFlag = data?.hostFlag ?? false;
    this.hostName = data?.hostFlag ?? '';
    this.partnerName = data?.partnerName ?? '';
    this.organizationName = data?.organizationName ?? '';
    this.eventName = data?.eventName;
    this.date = Utils.convertUTCtoDateString(data?.startTime, true);
    this.time = `${Utils.convertUTCtoTimeString(
      data?.startTime
    )} - ${Utils.convertUTCtoTimeString(data?.endTime)}`;
    this.eventStatus = data?.eventStatus;
    this.sendEmailFlag = data?.sendEmailFlag;
    this.publicModeFlag = data?.publicModeFlag ?? false;
    this.appointmentUrl = data?.appointmentUrl ?? '';
    this.reason = data?.reason ?? '';
    this.cexternalEventFlag = data?.cexternalEventFlag ?? false;
  }
}

export class SingleEventDetail {
  id!: number;
  eventName!: string;
  eventDescription!: string;
  eventStatus!: string;
  startTime!: string;
  endTime!: string;
  appointmentUrl?: string;
  sendEmailFlag!: boolean;
  orgName?: string;
  numberOfParticipants!: number;
  publicModeFlag!: boolean;
  publicPathMapping?: string;
  eventHosterId!: number;
  date?: string;
  location?: string;
  hostEmail?: string;
  hostFlag?: boolean;
  hostFullName?: string;
  participantFlag?: boolean;
  cexternalSlotFlag?: boolean;
  constructor(data?: any) {
    this.id = data?.id;
    this.date = Utils.convertUTCtoDateString(data?.startTime, true);
    this.startTime = `${Utils.convertUTCtoTimeString(data?.startTime)}`;
    this.endTime = `${Utils.convertUTCtoTimeString(data?.endTime)}`;
    this.eventName = data?.eventName;
    this.eventDescription = data?.eventDescription ?? '';
    this.appointmentUrl = data?.appointmentUrl ?? '';
    this.location = data?.location ?? '';
    this.eventStatus = data?.eventStatus ?? '';
    this.numberOfParticipants = data?.numberOfParticipants;
    this.hostEmail = data?.hostEmail ?? '';
    this.hostFlag = data?.hostFlag ?? false;
    this.hostFullName = data?.hostFullName ?? '';
    this.publicModeFlag = data?.publicModeFlag ?? false;
    this.participantFlag = data?.participantFlag ?? false;
    this.cexternalSlotFlag = data?.cexternalSlotFlag ?? false;
  }
}

export class SharedCalendarDetails {
  id!: number;
  ownerNotifyEmail!: string;
  title!: string;
  notifyImageLink!: string;
  notifyLink!: string;
  notifyDate!: string;
  seenFlag!: false;
}

export class EventCreateRequest {
  endTime!: string;
  eventDescription!: string;
  eventName!: string;
  partnerPathMapping!: string;
  startTime!: string;
  authorizationCode!: string;
  redirecetUri!: string;
}

export class BookingSlotRequest {
  eventDuration!: number;
  freeScheduleFlag!: boolean;
  fromDate!: string;
  toDate!: string;
  listDeviceId!: number[];
  listPartnerId!: number[];
}
export class ReschedulePublicRequest {
  eventDescription!: string;
  pathMappingKey!: string;
  reason!: string;
  rescheduleExternalSlotId!: number;
  shareCode!: string;
}
export class DateBookingSlot {
  code!: string;
  day!: string;
  date_ddmmyy!: string;
  date!: Date;
  selectFlag!: boolean;
}

export class MakeEventRequest {
  startTime!: string;
  endTime!: string;
  eventName!: string;
  eventDescription!: string;
  listDeviceId!: number[];
  listPartnerId!: number[];
  genMeetingLinkFlag!: boolean;
  publicModeFlag!: boolean;
  location!: string;
}

export class JoinEventRequest {
  eventId!: number;
  listEmailJoining!: string[];
  pathMappingKey!: string;
  shareCode!: string;
  singleEventFlag!: boolean;
}

export class ShareExternalSlotClient {
  id!: number;
  pathToShare!: string;
  pathMappingKey!: string;
  startTime!: any;
  endTime!: any;
  freeTimeType!: string;
  eventType!: string;
  sharePublicEventFlag!: boolean;
  shareFreeTimeScheduleFlag!: boolean;
  publicNewEventFlag!: boolean;
}

export class BookPublicRequest {
  eventDescription!: string;
  eventExternalSlotId!: number;
  eventName!: string;
  listPartnerEmail!: string[];
  pathMappingKey!: string;
  shareCode!: string;
  // startTime!: string;
  // endTime!: string;
}

export class CreateExternalSlotRequest {
  startTime!: string;
  endTime!: string;
  eventName!: string;
  generateMeetingLink!: boolean;
  listDeviceId!: string[];
  location!: string;
}

export class MakePublicShareRequest {
  startTime!: string;
  endTime!: string;
  eventDuration!: number;
  eventType!: string;
  freeTimeType!: string;
  publicNewEventFlag!: boolean;
  shareFreeTimeScheduleFlag!: boolean;
  sharePublicEventFlag!: boolean;
}
