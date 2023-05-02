import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ListTimeWorkingDatas, Schedule } from 'src/app/_models/schedule';
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
  constructor(
    private sanitizer: DomSanitizer,
    private organizationService: OrganizationService,
    private toastrService: ToastrService,
    private calendarService: CalendarService
  ) {}
  fileName: string = '';
  listEmployee: UserBusinessDetail[] = [];
  file: any;
  async ngOnInit(): Promise<void> {
    // this.listEmployee = [
    //   {
    //     id: 7,
    //     fullname: 'Nguyễn Phước Đăng',
    //     email: 'anakin9472@gmail.com',
    //     address: 'Thu Duc city',
    //     imagePath:
    //       'https://lh3.googleusercontent.com/a-/ACB-R5T06WP_UsAsujiRGdGxD3QjIIOk2Yo9s7ry5nE4=s96-c',
    //     effectiveDate: 1680972388312,
    //     managerFlag: true,
    //     eventHosterFlag: true,
    //   },
    //   {
    //     id: 8,
    //     fullname: 'User Default',
    //     email: 'userdefaultemail0fc727e2-7846-40d8-8ff7-c42ae1fc72b1@gmail.com',
    //     address: '',
    //     imagePath:
    //       'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
    //     effectiveDate: null,
    //     managerFlag: false,
    //     eventHosterFlag: false,
    //   },
    //   {
    //     id: 9,
    //     fullname: 'Nguyễn Hoàng Đức',
    //     email: 'nguyensonthach9472@gmail.com',
    //     address: '255 Đường Võ Văn Tần Phường 5, Quận 3, TP. Hồ Chí Minh',
    //     imagePath:
    //       'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
    //     effectiveDate: 1681173572564,
    //     managerFlag: false,
    //     eventHosterFlag: false,
    //   },
    //   {
    //     id: 10,
    //     fullname: 'Nguyễn Tuấn Anh',
    //     email: 'tinnt268@gmail.com',
    //     address: '255 Đường Võ Văn Tần Phường 5, Quận 3, TP. Hồ Chí Minh',
    //     imagePath:
    //       'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
    //     effectiveDate: 1681198386553,
    //     managerFlag: true,
    //     eventHosterFlag: true,
    //   },
    // ];
    // this.listEmployee.forEach((element, index) => {
    //   this.listEmployee[index].effectiveDate = Utils.convertUTCtoDDMMYY(
    //     element.effectiveDate
    //   );
    // });
    // this.dataSource = new MatTableDataSource<any>(this.listEmployee);
    try {
      let userData: any = await this.organizationService.getEmployee();
      if (userData.statusCode === 200) {
        this.listEmployee = userData.data.content;
        this.listEmployee.forEach((element, index) => {
          this.listEmployee[index].effectiveDate = Utils.convertUTCtoDDMMYY(
            element.effectiveDate
          );
        });
        this.dataSource = new MatTableDataSource<any>(this.listEmployee);
      }
    } catch (error) {
      debugger;
    }
  }

  toggleSidenav() {
    this.isOverlay = !this.isOverlay;
    this.isShowing = !this.isShowing;
  }

  toggleSidenavDefaultCalendar() {
    this.isOverlay = !this.isOverlay;
    this.isShowingAddDefault = !this.isShowingAddDefault;
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
        .addDefaultCalendar(this.defaultCalendarAddRequest)
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
}
