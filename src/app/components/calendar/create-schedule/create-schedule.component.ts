import { AnimationMetadataType } from '@angular/animations';
import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Time } from 'src/app/_models/time';
import { CalendarService } from 'src/app/_services/calendar.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ListTimeWorkingDatas, Schedule } from 'src/app/_models/schedule';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css'],
})
export class CreateScheduleComponent implements OnInit {
  formControlItem: UntypedFormControl = new UntypedFormControl('');
  createScheduleForm!: UntypedFormGroup;
  //list of schedules
  listTimeWorkingDatas: ListTimeWorkingDatas[] = [];
  weekdays: string[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  checkList: boolean[] = [false, false, false, false, false, false, false];
  checkListCopy: boolean[] = [false, false, false, false, false, false, false];
  timeArray: ListTimeWorkingDatas[][] = [[], [], [], [], [], [], []];
  isTimeNull: boolean = false;
  // private _isTimeNull = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: UntypedFormBuilder,
    private calendarService: CalendarService,
    private toastrService: ToastrService,
    @Optional() public dialogRef: MatDialogRef<CreateScheduleComponent>
  ) {}

  get name() {
    return this.createScheduleForm.get('name');
  }
  get brief() {
    return this.createScheduleForm.get('brief');
  }
  get timeData() {
    return this.createScheduleForm.get('timeData');
  }

  ngOnInit(): void {
    this.createScheduleForm = this.fb.group({
      name: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      brief: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
    });

    this.addDefaultTimeSets(this.weekdays, this.timeArray);
  }

  addNewSchedule(form: UntypedFormGroup) {
    const schedulesData: ListTimeWorkingDatas[] = [];
    for (let i = 0; i < this.timeArray.length; i++) {
      if (this.checkList[i]) {
        for (let j = 0; j < this.timeArray[i].length; j++) {
          schedulesData.push(this.timeArray[i][j]);
        }
      }
    }
    const requestData: Schedule = {
      name: form.value.name,
      brief: form.value.brief,
      listTimeWorkingDatas: schedulesData,
    };

    console.log(requestData);

    this.calendarService.create(requestData).subscribe((response: any) => {
      if (response == null) {
        this.toastrService.error('Please check your information', 'Error');
        return;
      } else {
        //get the statusCode
        if (response.statusCode != null) {
          if (response.statusCode == 200) {
            this.toastrService.success(
              'Create schedule successfully',
              'Success 200'
            );
            const isCreatedSuccessfully = true;
            const schedule: any = {
              id: response.data.id,
              name: response.data.name,
              brief: response.data.brief,
              listTimeWorkings: response.data.listTimeWorkings,
            };
            this.dialogRef.close({
              isCreatedSuccessfully: isCreatedSuccessfully,
              newSchedule: schedule,
            });
            return;
          }
          if (response.statusCode == 400) {
            this.toastrService.error(
              response.data[0].errorMessage,
              'Error 400'
            );
            return;
          }
        }
        //errorCode instead of statusCode
        else {
          if (response.errorCode == 400) {
            this.toastrService.error(response.errorMessage, 'Error 400');
          }
        }
      }
    });
  }

  addMoreEvent(index: number, weekday: string) {
    console.log('New event on this date');
    const newEvent: ListTimeWorkingDatas = {
      startTime: '',
      endTime: '',
      weekday: weekday,
      title: '',
    };
    this.timeArray[index].push(newEvent);
  }

  removeCurrentEvent(index: number, weekday: string) {
    console.log('Remove current on this date');
    this.timeArray[index].splice(-1);
  }

  timeValidator(control: UntypedFormControl) {
    // return (control: AbstractControl): ValidationErrors | null =>
    // {
    //   debugger

    //   console.log(control.value);
    //   console.log(this.isTimeNull);
    //   // const forbidden = nameRe.test(control.value);
    //   // return forbidden ? {forbiddenName: {value: control.value}} : null;
    //   if (this.isTimeNull) return {}
    //   return null
    // };
    if (this.isTimeNull) {
      return { isEmpty: true };
    }
    return null;
  }

  onStartTimeChange(value: any, indexDate: number, indexTimeOfDate: number) {
    const inputStartTime = this.timeArray[indexDate][indexTimeOfDate].startTime;
    const inputEndTime = this.timeArray[indexDate][indexTimeOfDate].endTime;

    if (inputEndTime != '' && inputEndTime <= inputStartTime) {
      this.toastrService.error(
        'End Time must be greater than Start Time',
        'TIME ERROR'
      );
    }

    if (indexTimeOfDate != 0) {
      for (let i = 0; i < this.timeArray[indexDate].length - 1; i++) {
        const timeArrayElement = this.timeArray[indexDate][i];
        if (inputEndTime == '') {
          if (
            timeArrayElement.startTime < inputStartTime &&
            inputStartTime < timeArrayElement.endTime
          ) {
            this.toastrService.error(
              'The event number #' +
                `${indexTimeOfDate + 1}` +
                ' overlaps on ' +
                `${timeArrayElement.weekday}`,
              'TIME OVERLAP ERROR'
            );
            return;
          }
        } else {
          if (
            timeArrayElement.startTime < inputEndTime &&
            inputStartTime < timeArrayElement.endTime
          ) {
            this.toastrService.error(
              'The event number #' +
                `${indexTimeOfDate + 1}` +
                ' overlaps on ' +
                `${timeArrayElement.weekday}`,
              'TIME OVERLAP ERROR'
            );
            return;
          }
        }
      }
    }
    return;
  }

  addDefaultTimeSets(weekdays: string[], timeArray: ListTimeWorkingDatas[][]) {
    for (let i = 0; i < weekdays.length; i++) {
      const event: ListTimeWorkingDatas = {
        startTime: '',
        endTime: '',
        weekday: weekdays[i],
        title: '',
      };
      timeArray[i].push(event);
    }
  }

  onCheckBoxChecked(event: any, index: number) {
    if (event.checked) {
      this.checkList[index] = true;
    } else {
      this.checkList[index] = false;
    }
  }

  onCheckBoxCopy(event: any, index: number) {
    if (event.checked) {
      this.checkListCopy[index] = true;
    } else {
      this.checkListCopy[index] = false;
    }
  }

  copyEvents(index: number) {
    for (let i = 0; i < this.checkListCopy.length; i++) {
      if (this.checkListCopy[i]) {
        if (
          this.timeArray[i][0].startTime == '' &&
          this.timeArray[i][0].endTime == ''
        ) {
          this.timeArray[i].splice(-1);
        }

        for (let j = 0; j < this.timeArray[index].length; j++) {
          const newEventCopy: ListTimeWorkingDatas = {
            startTime: this.timeArray[index][j].startTime,
            endTime: this.timeArray[index][j].endTime,
            weekday: this.weekdays[i],
            title: this.timeArray[index][j].title,
          };
          this.timeArray[i].push(newEventCopy);
        }
        this.checkList[i] = true;
        this.checkListCopy[i] = false;
      }
    }
  }

  @ViewChild('timepicker') timepicker: any;

  hide: boolean = true;

  /**
   * Lets the user click on the icon in the input.
   */
  openFromIcon(timepicker: { open: () => void }) {
    if (!this.formControlItem.disabled) {
      timepicker.open();
    }
  }

  /**
   * Function to clear FormControl's value, called from the HTML template using the clear button
   *
   * @param $event - The Event's data object
   */
  onClear($event: Event) {
    this.formControlItem.setValue(null);
  }

  getData() {}

  setDefaultData() {
    this.addSchedule('', 'rubber material');
  }

  addSchedule(startTime = '', endTime = '') {
    let schedule = this.createScheduleForm.get(
      'listTimeWorkingDatas'
    ) as UntypedFormArray;
    schedule.push(
      this.fb.group({
        startTime: [startTime],
        endTime: [endTime],
      })
    );
  }
}

class Time1 {
  startTime!: string;
  endTime!: string;
  weekday!: string;
}
