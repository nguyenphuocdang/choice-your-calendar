import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { el } from '@fullcalendar/core/internal-common';
import { ToastrService } from 'ngx-toastr';
import { OrganizationDetails } from 'src/app/_models/organization';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import {
  ListTimeWorkingDatas,
  ScheduleResponse,
} from 'src/app/_models/schedule';
import { UserBusinessDetail } from 'src/app/_models/user';
import { CalendarService } from 'src/app/_services/calendar.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-org-dashboard',
  templateUrl: './org-dashboard.component.html',
  styleUrls: ['./org-dashboard.component.scss'],
})
export class OrgDashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isShowing: boolean = false;
  isOverlay: boolean = false;
  isBusiness: boolean = false;
  organizationData: OrganizationDetails = {
    id: 0,
    code: '',
    name: '',
    description: '',
    organizationType: '',
  };
  tiles: any[] = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];
  cols: number[] = Array(7)
    .fill(0)
    .map((_, i) => i + 1); // Array with numbers 1 to 12
  morningWork: any[] = [];
  afternoonWork: any[] = [];
  rows: any[] = [
    [
      { value: '7 AM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '8 AM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '9 AM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '10 AM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '11 AM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '12 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '1 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '2 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '3 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '4 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '5 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
    [
      { value: '6 PM' },
      { day: 'MONDAY', status: '', value: '' },
      { day: 'TUESDAY', status: '', value: '' },
      { day: 'WEEKDAY', status: '', value: '' },
      { day: 'THURSDAY', status: '', value: '' },
      { day: 'FRIDAY', status: '', value: '' },
      { day: 'SATURDAY', status: '', value: '' },
      { day: 'SUNDAY', status: '', value: '' },
    ],
  ];

  listTimeWorkings: ScheduleResponse[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private organizationService: OrganizationService,
    private calendarService: CalendarService,
    private toastrService: ToastrService
  ) {}

  toggleSidenav() {
    this.isOverlay = !this.isOverlay;
    this.isShowing = !this.isShowing;
  }
  addOrganizationForm: UntypedFormGroup = this.fb.group({
    code: [''],
    description: [''],
    name: [''],
  });
  async ngOnInit() {
    this.getOrganizationDetail();
    this.getOrganizationDefaultSchedules();
  }

  getOrganizationDetail() {
    try {
      this.organizationService
        .getOrganizationDetail()
        .subscribe((response: ApiResponse<OrganizationDetails>) => {
          if (response.statusCode === 200) {
            this.organizationData = response.data;
            this.getNumberOfUsers();
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }

  getNumberOfUsers() {
    try {
      this.organizationService
        .getUserInOrganization()
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              //Not count the default User
              this.organizationData.numberUsers =
                response.data.totalElements - 1;
            } else {
              debugger;
            }
          }
        );
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting users', 'ERROR');
    }
  }

  getOrganizationDefaultSchedules() {
    try {
      this.organizationService
        .getOrganizationDefaultCalendar()
        .subscribe(
          (response: ApiResponse<DataListResponse<ScheduleResponse[]>>) => {
            if (response.statusCode === 200) {
              this.listTimeWorkings = response.data.content;
              this.listTimeWorkings.forEach((element) => {
                if (element.name == 'Morning Default Calendar') {
                  element.listTimeWorkings.forEach((listTimeWorkingData) => {
                    listTimeWorkingData.startTime =
                      Utils.convertTimeTo24HoursFormat(
                        listTimeWorkingData.startTime
                      );
                    listTimeWorkingData.endTime =
                      Utils.convertTimeTo24HoursFormat(
                        listTimeWorkingData.endTime
                      );
                    this.morningWork.push(listTimeWorkingData);
                  });
                } else if (element.name == 'Afternoon Default Calendar') {
                  element.listTimeWorkings.forEach((listTimeWorkingData) => {
                    listTimeWorkingData.startTime =
                      Utils.convertTimeTo24HoursFormat(
                        listTimeWorkingData.startTime
                      );
                    listTimeWorkingData.endTime =
                      Utils.convertTimeTo24HoursFormat(
                        listTimeWorkingData.endTime
                      );
                    this.afternoonWork.push(listTimeWorkingData);
                  });
                }
              });
              this.rows.forEach((element, rowIndex) => {
                if (rowIndex < this.rows.length / 2) {
                  this.morningWork.forEach((date, dateIndex) => {
                    if (date.startTime == element[0].value) {
                      element[dateIndex + 1].status = 'start_working_morning';
                      for (
                        let i = rowIndex + 1;
                        i < this.rows.length / 2;
                        i++
                      ) {
                        if (date.endTime == this.rows[i][0].value) {
                          this.rows[i][dateIndex + 1].status =
                            'end_working_morning';
                          break;
                        } else {
                          this.rows[i][dateIndex + 1].status =
                            'is_working_morning';
                        }
                      }
                    }
                  });
                } else {
                  this.afternoonWork.forEach((date, dateIndex) => {
                    if (date.startTime == element[0].value) {
                      element[dateIndex + 1].status = 'start_working_afternoon';
                      for (
                        let i = this.rows.length / 2;
                        i < this.rows.length;
                        i++
                      ) {
                        if (date.endTime == this.rows[i][0].value) {
                          this.rows[i][dateIndex + 1].status =
                            'end_working_afternoon';
                          break;
                        } else {
                          this.rows[i][dateIndex + 1].status =
                            'is_working_afternoon';
                        }
                      }
                    }
                  });
                }
              });
              debugger;
            }
          }
        );
    } catch (error) {}
  }

  onCreateOrganization() {
    let requestBody: any = {
      code: this.addOrganizationForm.value.code,
      description: this.addOrganizationForm.value.description,
      name: this.addOrganizationForm.value.name,
    };
    try {
      this.organizationService
        .createOrganization(requestBody)
        .subscribe(async (response: any) => {
          if (
            response.statusCode === 200 &&
            response.statusMessage == 'Successfully'
          ) {
            this.toastrService.success(
              'Your organization is created successfully',
              'SUCCESS'
            );
            let organizationDetail =
              await this.organizationService.getOrganizationDetailPromise();
            if (organizationDetail.statusCode === 200) {
              this.organizationData = organizationDetail.data;
              this.isBusiness = true;
              this.toggleSidenav();
            }
          } else {
            this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
