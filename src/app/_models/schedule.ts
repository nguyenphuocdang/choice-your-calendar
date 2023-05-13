export class Schedule {
  name!: string;
  brief!: string;
  listTimeWorkingDatas!: ListTimeWorkingDatas[];
}

export class FreeTimeScheduleSlots {
  name!: string;
  brief!: string;
  freeScheduleFlag!: boolean;
  listTimeWorkingDatas!: ListTimeWorkingDatas[];
}

export class ListTimeWorkingDatas {
  startTime!: string;
  endTime!: string;
  weekday!: string;
  title!: string;
}

export class ScheduleResponse {
  id!: number;
  name!: string;
  brief!: string;
  listTimeWorkings!: ListTimeWorkingDatas[];
  active!: string;
  effectiveDate!: string;
  expiriedDate!: string;
}

export class ModifyScheduleRequest {
  id!: number;
  name!: string;
  brief!: string;
  listTimeWorkingDatas!: ListTimeWorkingDatas[];
}

export class ShareScheduleRequest {
  endAvailabelDate!: string;
  listPartnerEmail!: string[];
  startAvailableDate!: string;
  duration!: string;
}

export class BasicEvent {
  title!: string;
  weekday!: string;
  startTime!: string;
  endTime!: string;
}

export class ScheduleDatas {
  scheduleId?: number;
  scheduleDatas!: ScheduleData[];
}
export class ScheduleData {
  day!: string;
  timeDatas!: TimeData[];
}
export class TimeData {
  title?: string;
  startTime!: string;
  endTime!: string;
  event?: boolean;
}

export class BookingSlot {
  selectFlag!: boolean;
  timeDatas!: TimeData;
}

export class AssignScheduleRequestBody {
  listDeviceId?: number[];
  listMemberId?: number[];
  scheduleId!: number;
}
