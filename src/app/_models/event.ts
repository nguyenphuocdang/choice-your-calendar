export class EventSearchRequest
{
    endTime!: string;
    eventDescription!: string;
    eventName!: string;
    hostName!: string;
    partnerName!: string;
    startTime!: string;
}
export class EventDetail
{
    id!: number;
    hostFlag!: boolean;
    hostName!: string;
    partnerName!: string
    organizationName!: string;
    eventName!: string;
    startTime!: string;
    endTime!: string;
    eventStatus!: string;
    sendEmailFlag!: boolean;
    appointmentUrl!: string;
    reason!: string;
}

export class SharedCalendarDetails
{
    id!: number;
    ownerNotifyEmail!: string;
    title!: string;
    notifyImageLink!: string;
    notifyLink!: string;
    notifyDate!: string;
    seenFlag!: false;
}

export class EventCreateRequest
{
    endTime!: string;
    eventDescription!: string;
    eventName!: string;
    partnerPathMapping!: string;
    startTime!: string;   
    authorizationCode!: string;
    redirecetUri!: string;
}