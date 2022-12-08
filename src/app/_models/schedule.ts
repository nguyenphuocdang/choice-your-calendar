export class Schedule
{
    name!:string;
    brief!:string;
    listTimeWorkingDatas!: ListTimeWorkingDatas[];
}

export class ListTimeWorkingDatas
{
    startTime!:string;
    endTime!:string;
    weekday!:string;
    title!:string;
}

export class ScheduleResponse
{
    id!: number;
    name!:string;
    brief!:string;
    listTimeWorkingDatas!: ListTimeWorkingDatas[];
    active!: string; 
    effectiveDate!:string;
    expiriedDate!:string;
}

export class ModifyScheduleRequest
{
    id!: number;
    name!:string;
    brief!:string;
    listTimeWorkingDatas!: ListTimeWorkingDatas[];
}




