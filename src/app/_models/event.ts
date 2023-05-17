import Utils from '../_utils/utils';
import { BookingResourcesComponent } from '../components/organization/resources/booking-resources/booking-resources.component';

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
  appointmentUrl?: string;
  reason?: string;
  constructor(data?: any) {
    this.id = data?.id;
    this.hostFlag = data?.hostFlag;
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
    this.appointmentUrl = data?.appointmentUrl ?? '';
    this.reason = data?.reason ?? '';
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

export class DateBookingSlot {
  code!: string;
  day!: string;
  date_ddmmyy!: string;
  date!: Date;
  selectFlag!: boolean;
}
