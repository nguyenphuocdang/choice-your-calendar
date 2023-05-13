import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { J } from '@fullcalendar/core/internal-common';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import {
  AssignScheduleRequestBody,
  ListTimeWorkingDatas,
  Schedule,
  ScheduleResponse,
} from 'src/app/_models/schedule';
import { UserBusinessDetail } from 'src/app/_models/user';
import { CalendarService } from 'src/app/_services/calendar.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  isShowing: boolean = false;
  isShowingAddDefault: boolean = false;
  isShowingAssign: boolean = false;
  isOverlay: boolean = false;
  public dataSource!: MatTableDataSource<UserBusinessDetail>;
  title: string = '';
  brief: string = '';
  startTime: string = '';
  endTime: string = '';
  displayedColumns: string[] = [
    'select',
    'fullname',
    'email',
    'address',
    'imagePath',
    'effectiveDate',
    'managerFlag',
    'eventHosterFlag',
  ];
  defaultCalendarAddRequest: Schedule = {
    name: '',
    brief: '',
    listTimeWorkingDatas: [],
  };
  listTimeWorkingDatas: Schedule[] = [];
  weekdays: string[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  morningWorkingTime: string = '';
  afternoonWorkingTime: string = '';
  morningWorkingDays: string = '';
  afternoonWorkingDays: string = '';
  assignMorningFlag: boolean = false;
  assignAfternoonFlag: boolean = false;
  morningScheduleId: number = -1;
  afternoonScheduleId: number = -1;
  constructor(
    private sanitizer: DomSanitizer,
    private organizationService: OrganizationService,
    private toastrService: ToastrService,
    private calendarService: CalendarService
  ) {}
  fileName: string = '';
  listEmployee: UserBusinessDetail[] = [];
  allSelected: boolean = false;
  listAssignEmployeeIDs: number[] = [];
  file: any;
  async ngOnInit(): Promise<void> {
    await this.getAllUsers();
  }

  async getAllUsers() {
    try {
      let userData: any = await this.organizationService.getEmployee();
      if (userData.statusCode === 200) {
        this.listEmployee = userData.data.content;
        this.listEmployee.forEach((element, index) => {
          this.listEmployee[index].effectiveDate = Utils.convertUTCtoDDMMYY(
            element.effectiveDate
          );
          this.listEmployee[index].selected = false;
        });
        this.dataSource = new MatTableDataSource<any>(this.listEmployee);
      }
    } catch (error) {
      debugger;
    }
  }

  toggleSidenav() {
    // this.isOverlay = !this.isOverlay;
    this.isShowing = !this.isShowing;
  }

  toggleSidenavDefaultCalendar() {
    // this.isOverlay = !this.isOverlay;
    this.isShowingAddDefault = !this.isShowingAddDefault;
  }

  toggleSidenavAssign() {
    this.getDefaultSchedules();
    this.isShowingAssign = !this.isShowingAssign;
  }

  closeSidenavAssign() {
    if (this.isShowingAssign) this.isShowingAssign = !this.isShowingAssign;
  }

  downloadExcel() {
    const fileUrl = 'assets/sheet/TemplateImportUser.xlsx';
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.target = '_blank';
    downloadLink.download = 'TemplateImportUser.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  importFile() {
    const fileInput = this.fileInput!.nativeElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
      this.fileName = this.file.name;
    } else {
      this.fileName = '';
    }
  }
  onAddEmployee() {
    try {
      this.organizationService
        .addEmployee(this.file)
        .subscribe((response: any) => {
          if (
            response.statusCode === 200 &&
            response.statusMessage == 'Successfully'
          ) {
            this.toastrService.success(
              'Your organization is created successfully',
              'SUCCESS'
            );

            debugger;
          } else {
            debugger;
            this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
          }
        });
    } catch (error) {
      debugger;
    }
  }
  onAddDefaultCalendar() {
    this.defaultCalendarAddRequest.name = this.title;
    this.defaultCalendarAddRequest.brief = this.brief;
    for (let i = 0; i < 7; i++) {
      let scheduleElement: ListTimeWorkingDatas = {
        startTime: this.startTime,
        endTime: this.endTime,
        weekday: this.weekdays[i],
        title: `${this.weekdays[i]} sheet`,
      };
      this.defaultCalendarAddRequest.listTimeWorkingDatas.push(scheduleElement);
    }
    try {
      this.calendarService
        .createDefaultSchedule(this.defaultCalendarAddRequest)
        .subscribe(async (response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Your default calendar for organziation is created successfully',
              'SUCCESS'
            );
            // let userData: any = await this.organizationService.getEmployee();
            // this.listEmployee = userData.data.content;
            // this.listEmployee.forEach((element, index) => {
            //   this.listEmployee[index].effectiveDate =
            //     Utils.convertUTCtoDateString(element.effectiveDate);
            // });
            // this.dataSource = new MatTableDataSource<any>(this.listEmployee);
          } else {
            debugger;
            this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
          }
        });
    } catch (error) {
      debugger;
    }
  }

  onAssignCalendar() {}

  selectAllUsers() {
    this.listEmployee.forEach((user: UserBusinessDetail) => {
      user.selected = this.allSelected;
    });
  }

  selectUser() {}

  getDefaultSchedules() {
    try {
      this.organizationService
        .getOrganizationDefaultCalendar()
        .subscribe(
          (response: ApiResponse<DataListResponse<ScheduleResponse[]>>) => {
            if (response.statusCode === 200) {
              this.morningScheduleId = response.data.content[0].id;
              this.morningWorkingTime = `${response.data.content[0].listTimeWorkings[0].startTime} - ${response.data.content[0].listTimeWorkings[0].endTime}`;
              this.morningWorkingDays = `From ${this.tolowerKeepFirstLetter(
                response.data.content[0].listTimeWorkings[0].weekday
              )} to ${this.tolowerKeepFirstLetter(
                response.data.content[0].listTimeWorkings[
                  response.data.content[0].listTimeWorkings.length - 1
                ].weekday
              )}`;

              this.afternoonScheduleId = response.data.content[1].id;
              this.afternoonWorkingTime = `${response.data.content[1].listTimeWorkings[0].startTime} - ${response.data.content[1].listTimeWorkings[0].endTime}`;
              this.afternoonWorkingDays = `From ${this.tolowerKeepFirstLetter(
                response.data.content[1].listTimeWorkings[0].weekday
              )} to ${this.tolowerKeepFirstLetter(
                response.data.content[1].listTimeWorkings[
                  response.data.content[1].listTimeWorkings.length - 1
                ].weekday
              )}`;
            }
          }
        );
    } catch (error) {}
  }

  tolowerKeepFirstLetter(upperWord: string) {
    const formattedWord =
      upperWord.charAt(0) + upperWord.slice(1).toLowerCase();
    return formattedWord;
  }

  assignSchedule() {
    debugger;
    this.listEmployee.forEach((employee) => {
      if (employee.selected) this.listAssignEmployeeIDs.push(employee.id);
    });
    const requestBody: AssignScheduleRequestBody = {
      listDeviceId: [],
      scheduleId: -1,
      listMemberId: this.listAssignEmployeeIDs,
    };
    if (this.assignMorningFlag && !this.assignAfternoonFlag) {
      requestBody.scheduleId = this.morningScheduleId;
      this._assignSchedule(requestBody);
    } else if (!this.assignMorningFlag && this.assignAfternoonFlag) {
      requestBody.scheduleId = this.afternoonScheduleId;
      this._assignSchedule(requestBody);
    } else {
      requestBody.scheduleId = this.morningScheduleId;
      this._assignSchedule(requestBody);
      requestBody.scheduleId = this.afternoonScheduleId;
      this._assignSchedule(requestBody);
    }
  }
  _assignSchedule(requestBody: AssignScheduleRequestBody) {
    try {
      this.organizationService
        .assignSchedule(requestBody)
        .subscribe((response: ApiResponse<boolean>) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Assign schedule successfully',
              'SUCCESS'
            );
            debugger;
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
