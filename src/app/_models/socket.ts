export interface SocketMessage<T> {
  messageFrom: number;
  messageFromEmail: string;
  messageTo: string;
  content: T;
  messageType: any;
}

export class NotifyUserJoinEvent {
  allNewPartnerEmail!: string;
  eventName!: string;
}

export class RequestDeviceToApprover {
  borrowId!: number;
  eventName!: string;
  deviceCode!: string;
  deviceName!: string;
  startTime!: string;
  endTime!: string;
  requesterFullName!: string;
  requesterEmail!: string;
}

export class ResponseBorrowDeviceToClient {
  eventName!: string;
  rejectedDeviceName!: string;
  rejectedDeviceCode!: string;
  deviceType!: string;
}
