import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { ListTimeWorkingDatas } from 'src/app/_models/schedule';
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
  organizationData: any = {
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
  // rows: any[] = [
  //   // Array of row data
  //   [1], // Row 1 data
  //   [2], // Row 2 data
  //   [3],
  //   [4],
  //   [5],
  //   [6],
  //   [7],
  //   [8],
  //   [9],
  //   [10],
  //   [11],
  //   [12],
  // ];
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

  listTimeWorkings: ListTimeWorkingDatas[] = [];

  // rows: number[] = Array(12)
  //   .fill(0)
  //   .map((_, i) => i + 1);
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
    try {
      let organizationDetail =
        await this.organizationService.getOrganizationDetailPromise();
      if (organizationDetail.statusCode === 200) {
        this.organizationData = organizationDetail.data;
        this.isBusiness = true;
      }
    } catch (error) {
      debugger;
    }
    this.getBusinessDefaultCalendar();
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

  async getBusinessDefaultCalendar() {
    try {
      const defaultCalendar: any =
        await this.calendarService.getCalendarUserBusiness();
      if (defaultCalendar.statusCode === 200) {
        this.listTimeWorkings = defaultCalendar.data.listTimeWorkings;
        debugger;
        this.listTimeWorkings.forEach((element: any, index: number) => {
          debugger;
          element.startTime = Utils.convertTimeTo24HoursFormat(
            element.startTime
          );
          element.endTime = Utils.convertTimeTo24HoursFormat(element.endTime);
          if (element.title == 'Morning Work') {
            this.morningWork.push(element);
          }
          if (element.title == 'Afternoon Work') {
            this.afternoonWork.push(element);
          }
        });

        this.rows.forEach((element, rowIndex) => {
          if (rowIndex < this.rows.length / 2) {
            this.morningWork.forEach((date, dateIndex) => {
              if (date.startTime == element[0].value) {
                element[dateIndex + 1].status = 'start_working_morning';
                for (let i = rowIndex + 1; i < this.rows.length / 2; i++) {
                  if (date.endTime == this.rows[i][0].value) {
                    this.rows[i][dateIndex + 1].status = 'end_working_morning';
                    break;
                  } else {
                    this.rows[i][dateIndex + 1].status = 'is_working_morning';
                  }
                }
              }
            });
          } else {
            this.afternoonWork.forEach((date, dateIndex) => {
              if (date.startTime == element[0].value) {
                element[dateIndex + 1].status = 'start_working_afternoon';
                for (let i = this.rows.length / 2; i < this.rows.length; i++) {
                  if (date.endTime == this.rows[i][0].value) {
                    this.rows[i][dateIndex + 1].status =
                      'end_working_afternoon';
                    break;
                  } else {
                    this.rows[i][dateIndex + 1].status = 'is_working_afternoon';
                  }
                }
              }
            });
          }
        });
      }
      debugger;
    } catch (error) {
      debugger;
    }
  }
}
