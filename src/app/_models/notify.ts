import Utils from '../_utils/utils';

export class NotificationData {
  content!: NotificationContent[];
}

export class NotificationContent {
  id!: number;
  notifyDate!: any;
  notifyImageLink!: string;
  notifyLink!: string;
  ownerNotifyEmail!: string;
  seenFlag!: boolean;
  title!: string;
  constructor(data?: any) {
    this.id = data?.id;
    this.notifyDate = `${Utils.convertUTCtoDateString(data?.notifyDate, true)}`;
    this.notifyImageLink = data?.notifyImageLink;
    this.notifyLink = data?.notifyLink;
    this.ownerNotifyEmail = data?.ownerNotifyEmail;
    this.seenFlag = data?.seenFlag;
    this.title = data?.title;
  }
}
