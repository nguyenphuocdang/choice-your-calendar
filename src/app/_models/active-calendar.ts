export class ActiveCalendar{
    day!: string;
    timeDatas!: TimeData[];
}

export class TimeData
{
    startTime!: string;
    endTime!: string;
    event!: boolean;
}
