import {
  Component,
  ElementRef,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { AssignedPermission } from 'src/app/_models/organization';
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
import { ResourceCalendarComponent } from '../../calendar/resource-calendar/resource-calendar.component';
import { MatDialog } from '@angular/material/dialog';

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
  defaultPageIndex: number = 0;
  defaultPageSize: number = 9;
  defaultNumberUsers: number = 0;
  title: string = '';
  brief: string = '';
  startTime: string = '';
  endTime: string = '';
  displayedColumns: string[] = [
    'select',
    'fullname',
    'email',
    'shift',
    'view',
    'address',
    'imagePath',
    'effectiveDate',
    'managerFlag',
    'eventHosterFlag',
    'createPublicEventFlag',
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
  fullTimeWorkingTime: string = '';
  morningWorkingDays: string = '';
  afternoonWorkingDays: string = '';
  fullTimeWorkingDays: string = '';
  assignMorningFlag: boolean = false;
  assignAfternoonFlag: boolean = false;
  assignFullTimeFlag: boolean = false;
  morningScheduleId: number = -1;
  afternoonScheduleId: number = -1;
  fullTimeScheduleId: number = -1;
  selectedAssignPermission: string = '';
  disableButtonAssignEventHoster: boolean = false;
  disableButtonAssignPublicEventHoster: boolean = false;
  constructor(
    private organizationService: OrganizationService,
    private toastrService: ToastrService,
    private calendarService: CalendarService,
    @Optional() private dialog: MatDialog
  ) {}
  fileName: string = '';
  listEmployee: UserBusinessDetail[] = [];
  allSelected: boolean = false;
  listAssignEmployeeIDs: number[] = [];
  currentGrantedUserIndex: number = -1;
  file: any;
  ngOnInit(): void {
    this.getUserInOrganization(this.defaultPageIndex, this.defaultPageSize + 1);
  }

  getUserInOrganization(pageIndex: number, size: number) {
    try {
      this.organizationService
        .getUserInOrganization(
          0,
          pageIndex,
          0,
          0,
          size,
          true,
          false,
          true,
          false
        )
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              this.defaultNumberUsers = response.data.totalElements - 1;
              let indexOfDefaultUser: number = -1;
              response.data.content.forEach((element, index) => {
                if (element.fullname === 'User Default') {
                  indexOfDefaultUser = index;
                } else {
                  element.effectiveDate = Utils.convertUTCtoDDMMYY(
                    element.effectiveDate
                  );
                  element.selected = false;
                  if (element.scheduleName === 'Morning Default Calendar')
                    element.shift = 'Morning';
                  else if (
                    element.scheduleName === 'Afternoon Default Calendar'
                  )
                    element.shift = 'Afternoon';
                  else if (
                    element.scheduleName === 'Full-Time Default Calendar'
                  )
                    element.shift = 'Full-time';
                  else element.shift = 'Unassigned';
                }

                // this.getUserScheduleType(
                //   response.data.content[index].id
                // ).subscribe((result) => {
                //   response.data.content[index].shift = result;
                // });
              });
              if (indexOfDefaultUser != -1)
                response.data.content.splice(indexOfDefaultUser, 1);
              this.listEmployee = response.data.content;
              this.dataSource = new MatTableDataSource<any>(this.listEmployee);
            }
          }
        );
    } catch (error) {
      debugger;
    }
  }

  pageChanged(event: PageEvent) {
    this.getUserInOrganization(event.pageIndex, this.defaultPageSize + 1);
  }

  getUserScheduleType(id: number): Observable<string> {
    return this.organizationService.getUserScheduleById(id).pipe(
      map((response: ApiResponse<ScheduleResponse>) => {
        if (response.statusCode === 200) {
          if (response.data.name === 'Full-Time Default Calendar')
            return 'Full-time';
          else if (response.data.name === 'Morning Default Calendar')
            return 'Morning';
          else return 'Afternoon';
        } else {
          return 'Unassigned';
        }
      })
    );
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
            this.dataSource.connect();
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
              response.data.content.forEach((element, index) => {
                if (element.name === 'Morning Default Calendar') {
                  this.morningScheduleId = element.id;
                  this.morningWorkingTime = `${element.listTimeWorkings[0].startTime} - ${element.listTimeWorkings[0].endTime}`;
                  this.morningWorkingDays = `From ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[0].weekday
                  )} to ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[
                      element.listTimeWorkings.length - 1
                    ].weekday
                  )}`;
                } else if (element.name === 'Afternoon Default Calendar') {
                  this.afternoonScheduleId = element.id;
                  this.afternoonWorkingTime = `${element.listTimeWorkings[0].startTime} - ${element.listTimeWorkings[0].endTime}`;
                  this.afternoonWorkingDays = `From ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[0].weekday
                  )} to ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[
                      element.listTimeWorkings.length - 1
                    ].weekday
                  )}`;
                } else if (element.name === 'Full-Time Default Calendar') {
                  this.fullTimeScheduleId = element.id;
                  this.fullTimeWorkingDays = `From ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[0].weekday
                  )} to ${this.tolowerKeepFirstLetter(
                    element.listTimeWorkings[
                      element.listTimeWorkings.length - 1
                    ].weekday
                  )}`;
                  this.fullTimeWorkingTime = `${element.listTimeWorkings[0].startTime} - ${element.listTimeWorkings[0].endTime} and
                  ${element.listTimeWorkings[1].startTime} - ${element.listTimeWorkings[1].endTime}`;
                }
              });
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
    this.listAssignEmployeeIDs = [];
    this.listEmployee.forEach((employee) => {
      if (employee.selected) this.listAssignEmployeeIDs.push(employee.id);
    });
    const requestBody: AssignScheduleRequestBody = {
      listDeviceId: [],
      scheduleId: -1,
      listMemberId: this.listAssignEmployeeIDs,
    };
    let flag: string = '';
    if (
      this.assignMorningFlag &&
      !this.assignAfternoonFlag &&
      !this.assignFullTimeFlag
    ) {
      requestBody.scheduleId = this.morningScheduleId;
      flag = 'Morning';
      this._assignSchedule(requestBody, flag);
    } else if (
      !this.assignMorningFlag &&
      this.assignAfternoonFlag &&
      !this.assignFullTimeFlag
    ) {
      requestBody.scheduleId = this.afternoonScheduleId;
      flag = 'Afternoon';
      this._assignSchedule(requestBody, flag);
    } else {
      if (this.assignFullTimeFlag) {
        requestBody.scheduleId = this.fullTimeScheduleId;
        flag = 'Full-time';
        this._assignSchedule(requestBody, flag);
      } else {
        this.toastrService.warning('Please select time shift', 'Warning');
      }
    }
  }
  _assignSchedule(requestBody: AssignScheduleRequestBody, flag: string) {
    try {
      this.organizationService
        .assignSchedule(requestBody)
        .subscribe((response: ApiResponse<boolean>) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              'Assign schedule successfully',
              'SUCCESS'
            );
            this.listAssignEmployeeIDs.forEach((element) => {
              const index = this.listEmployee.findIndex(
                (item) => item.id === element
              );
              this.listEmployee[index].shift = flag;
            });
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }
  handleAssignPermissionClicked() {
    const findCheckBoxUser: number = this.listEmployee.findIndex(
      (item) => item.selected == true
    );
    this.currentGrantedUserIndex = -1;
    this.disableButtonAssignEventHoster = false;
    this.disableButtonAssignPublicEventHoster = false;
    this.selectedAssignPermission = '';
    if (findCheckBoxUser !== -1) {
      {
        if (
          this.listEmployee[findCheckBoxUser].eventHosterFlag &&
          this.listEmployee[findCheckBoxUser].createPublicEventFlag
        ) {
          this.disableButtonAssignEventHoster = true;
          this.disableButtonAssignPublicEventHoster = true;
        } else if (this.listEmployee[findCheckBoxUser].eventHosterFlag) {
          this.disableButtonAssignEventHoster = true;
        } else if (this.listEmployee[findCheckBoxUser].createPublicEventFlag) {
          this.disableButtonAssignPublicEventHoster = true;
        }
        this.currentGrantedUserIndex = findCheckBoxUser;
      }
    }
  }
  handleRadioButtonAssignPermissionClicked(option: string) {
    if (this.currentGrantedUserIndex !== -1) {
      let requestBody: AssignedPermission = {
        createEventFlag: option === 'event-hoster' ? true : false,
        createPublicEventFlag: option === 'public-event-hoster' ? true : false,
        grantedUserId: this.listEmployee[this.currentGrantedUserIndex].id,
        managerFlag: false,
      };
      if (this.listEmployee[this.currentGrantedUserIndex].createPublicEventFlag)
        requestBody.createPublicEventFlag = true;
      if (this.listEmployee[this.currentGrantedUserIndex].eventHosterFlag)
        requestBody.createEventFlag = true;
      this._assignAuthority(requestBody);
    }
  }
  _assignAuthority(requestBody: AssignedPermission) {
    try {
      this.organizationService
        .assignAuthority(requestBody)
        .subscribe((response: ApiResponse<AssignedPermission>) => {
          if (response.statusCode === 200) {
            if (response.data.createEventFlag)
              this.listEmployee[this.currentGrantedUserIndex].eventHosterFlag =
                true;
            if (response.data.createPublicEventFlag)
              this.listEmployee[
                this.currentGrantedUserIndex
              ].createPublicEventFlag = true;
            this.toastrService.success(
              `Assign Authority Permission For User ${
                this.listEmployee[this.currentGrantedUserIndex].fullname
              } successfully.`,
              'SUCCESS',
              Utils.toastrConfig
            );
          } else {
            this.toastrService.error(
              response.errors.errorMessage,
              'ERROR',
              Utils.toastrConfig
            );
          }
        });
    } catch (error) {
      debugger;
    }
  }

  viewResourceCalendar(user: UserBusinessDetail) {
    const dialogRef = this.dialog.open(ResourceCalendarComponent, {
      width: '1200px',
      height: '680px',
      data: {
        id: user.id,
        resourceType: 'user',
      },
    });
  }
}
