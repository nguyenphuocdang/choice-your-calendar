import Utils from '../_utils/utils';

export class socketRequest {
  content!: string;
  messageFrom!: string;
  messageFromEmail!: string;
  messageTo!: string;
  messageType!: string;
}

export class DeviceBorrowRequest {
  borrowId!: number;
  eventName!: string;
  deviceCode!: string;
  deviceName!: string;
  date!: string;
  startTime!: string;
  endTime!: string;
  requesterFullName!: string;
  requesterEmail!: string;
  borrowState!: string;
  constructor(data?: any) {
    this.borrowId = data?.borrowId;
    this.eventName = data?.eventName;
    this.deviceCode = data?.deviceCode;
    this.deviceName = data?.deviceName;
    this.date = Utils.convertUTCtoDateString(data?.startTime, true);
    this.startTime = Utils.convertUTCtoTimeString(data?.startTime);
    this.endTime = Utils.convertUTCtoTimeString(data?.endTime);
    this.requesterFullName = data?.requesterFullName;
    this.requesterEmail = data?.requesterEmail;
    this.borrowState = data?.borrowState;
  }
}
