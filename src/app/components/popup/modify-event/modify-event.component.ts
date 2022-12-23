import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateSelectArg } from '@fullcalendar/angular';
import { ToastrService } from 'ngx-toastr';
import { BasicEvent, ModifyScheduleRequest } from 'src/app/_models/schedule';
import { CalendarService } from 'src/app/_services/calendar.service';

@Component({
  selector: 'app-modify-event',
  templateUrl: './modify-event.component.html',
  styleUrls: ['./modify-event.component.css']
})
export class ModifyEventComponent implements OnInit {

  modalTitle!: string;
  title!:string;
  isModified: boolean = false;
  scheduleId!: number;
  date: string= '';
  startTime : string = '';
  endTime: string = '';
  weekdays: string[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  selectInfo!: DateSelectArg;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  @Optional() public dialogRef: MatDialogRef<ModifyEventComponent>,
  private CalendarService: CalendarService,
  private ToastrService: ToastrService) 
  { 
    this.modalTitle = data.title;
    this.selectInfo = data.selectInfo ?? '';
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.scheduleId = data.scheduleId ?? '';
  }

  ngOnInit(): void 
  {
  }

  async modifyEvent()
  {
    const [time, modifier] = this.startTime.split(':00 ');
    this.startTime = '0' + time;
    const [stime, smodifier] = this.endTime.split(':00 ');
    this.endTime = '0' + stime;

    let newEvent: BasicEvent = 
      {
        weekday: "",
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
      }
    let _convertToDate : Date = new Date(this.date);
    let _getDate = _convertToDate.getDay();
    if (_getDate == 0) newEvent.weekday = 'SUNDAY';
    else if (_getDate == 1) newEvent.weekday = 'MONDAY';
    else if (_getDate == 2) newEvent.weekday = 'TUESDAY';
    else if (_getDate == 3) newEvent.weekday = 'WEDNESDAY';
    else if (_getDate == 4) newEvent.weekday = 'THURSDAY';
    else if (_getDate == 5) newEvent.weekday = 'FRIDAY';
    else if (_getDate == 6) newEvent.weekday = 'SATURDAY';
      try 
      {
        const responseDetailCalendar = await this.CalendarService.getScheduleDetailPromise(this.scheduleId);
        if (responseDetailCalendar!= null)
        {
          let modifiedSchedule: ModifyScheduleRequest = {
            id: this.scheduleId,
            name: (<any>responseDetailCalendar).data.name,
            brief: (<any>responseDetailCalendar).data.brief,
            listTimeWorkingDatas: (<any>responseDetailCalendar).data.listTimeWorkings,
          }
          modifiedSchedule.listTimeWorkingDatas.push(newEvent);
          debugger
          this.CalendarService.updateCalendar(modifiedSchedule).subscribe(
            (response: any) =>
            {
              debugger
              if (response.statusCode === 200 )
              {
                this.ToastrService.success('New Event Added Successfully', '200 Success');
                this.isModified = true;
                this.dialogRef.close({'isModified': this.isModified, 'title': modifiedSchedule.name}); 
              }
              else 
              {
                this.ToastrService.error(response.errorMessage, '400 ERROR');
                this.isModified = false;
                this.dialogRef.close({'isModified': this.isModified, 'title': modifiedSchedule.name}); 
              }
            }
          )
        }
      
        
      } 
      catch (error) 
      {
        //handle error
      }
  }


}
