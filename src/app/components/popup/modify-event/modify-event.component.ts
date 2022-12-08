import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateSelectArg } from '@fullcalendar/angular';

@Component({
  selector: 'app-modify-event',
  templateUrl: './modify-event.component.html',
  styleUrls: ['./modify-event.component.css']
})
export class ModifyEventComponent implements OnInit {

  modalTitle!: string;
  scheduleId!: number;
  weekdays: string[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  selectInfo!: DateSelectArg;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) 
  { 
    this.modalTitle = data.title;
    this.selectInfo = data.selectInfo ?? '';
  }

  ngOnInit(): void 
  {
    debugger
  }

}
