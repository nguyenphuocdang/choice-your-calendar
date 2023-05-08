import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {
  MatDrawerContainer,
  MatSidenav,
  MatSidenavContainer,
} from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import {
  BookingSlotRequest,
  DateBookingSlot,
  EventDetail,
  EventSearchRequest,
} from 'src/app/_models/event';
import { SearchResourceRequestBody } from 'src/app/_models/request';
import { ResourceBasicInfo, ResourceDetail } from 'src/app/_models/resource';
import {
  ApiResponse,
  CustomError,
  DataListResponse,
} from 'src/app/_models/response';
import {
  BookingSlot,
  ScheduleData,
  ScheduleDatas,
  TimeData,
} from 'src/app/_models/schedule';
import { UserBusinessDetail } from 'src/app/_models/user';
import { EventService } from 'src/app/_services/event.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import { DeviceService } from 'src/app/_services/resource.service';
import { UserService } from 'src/app/_services/user.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-booking-resources',
  templateUrl: './booking-resources.component.html',
  styleUrls: ['./booking-resources.component.scss'],
})
export class BookingResourcesComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  resourceType: ResourceBasicInfo[] = [
    {
      label: 'Meeting Room',
      value: 'ROOM',
    },
    {
      label: 'Support Device',
      value: 'DEVICE',
    },
    {
      label: 'Person',
      value: 'PERSON',
    },
  ];
  resourceRoom: ResourceDetail[] = [
    {
      id: 5,
      code: 'ROOM01',
      name: 'Meeting Room 01',
      location: '1',
      description: 'Meeting Room 01',
      imagePath: '',
      deviceType: 'ROOM',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 6,
      code: 'ROOM02',
      name: 'Meeting Room 02',
      location: '2',
      description: 'Meeting Room 02',
      imagePath: '',
      deviceType: 'ROOM',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 7,
      code: 'ROOM03',
      name: 'Meeting Room 03',
      location: '3',
      description: 'Meeting Room 03',
      imagePath: '',
      deviceType: 'ROOM',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 8,
      code: 'ROOM04',
      name: 'Meeting Room 04',
      location: '4',
      description: 'Meeting Room 04',
      imagePath: '',
      deviceType: 'ROOM',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
  ];
  resourceSupportDevice: ResourceDetail[] = [
    {
      id: 9,
      code: 'TELEVISION01',
      name: 'Television 01',
      location: '1',
      description: 'Television 01',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 10,
      code: 'TELEVISION02',
      name: 'Television 02',
      location: '2',
      description: 'Television 02',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 11,
      code: 'TELEVISION03',
      name: 'Television 03',
      location: '3',
      description: 'Television 03',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 12,
      code: 'DESKTOP01',
      name: 'Desktop 01',
      location: '1',
      description: 'Desktop 01',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 13,
      code: 'DESKTOP02',
      name: 'Desktop 02',
      location: '2',
      description: 'Desktop 02',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 14,
      code: 'DESKTOP03',
      name: 'Desktop 03',
      location: '3',
      description: 'Desktop 03',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Phước Đăng',
    },
    {
      id: 4,
      code: 'TELEVISION',
      name: 'Meeting Room Television',
      location: 'Meeting Room',
      description: 'Meeting Room Television',
      imagePath: '',
      deviceType: 'DEVICE',
      enable: true,
      deviceDefaultFlag: false,
      approverFullName: 'Nguyễn Tuấn Anh',
    },
  ];
  resourcePeople: UserBusinessDetail[] = [
    {
      id: 7,
      fullname: 'Nguyễn Phước Đăng',
      email: 'anakin9472@gmail.com',
      address: 'Thu Duc city',
      imagePath:
        'https://lh3.googleusercontent.com/a-/ACB-R5T06WP_UsAsujiRGdGxD3QjIIOk2Yo9s7ry5nE4=s96-c',
      effectiveDate: 1680972388312,
      managerFlag: true,
      eventHosterFlag: true,
      hostFlag: true,
      createPublicEventFlag: true,
    },
    {
      id: 9,
      fullname: 'Nguyễn Hoàng Đức',
      email: 'nguyensonthach9472@gmail.com',
      address: '255 Đường Võ Văn Tần Phường 5, Quận 3, TP. Hồ Chí Minh',
      imagePath:
        'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
      effectiveDate: 1681173572564,
      managerFlag: false,
      eventHosterFlag: false,
      hostFlag: false,
      createPublicEventFlag: false,
    },
    {
      id: 10,
      fullname: 'Nguyễn Tuấn Anh',
      email: 'tinnt268@gmail.com',
      address: '255 Đường Võ Văn Tần Phường 5, Quận 3, TP. Hồ Chí Minh',
      imagePath:
        'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
      effectiveDate: 1681198386553,
      managerFlag: true,
      eventHosterFlag: true,
      hostFlag: false,
      createPublicEventFlag: false,
    },
    {
      id: 11,
      fullname: 'Châu Ngọc Quang',
      email: 'nguyenphuocdang1234@gmail.com',
      address: 'Quang Trung, P.Tây Sơn, Thành phố Pleiku, Gia Lai ',
      imagePath:
        'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
      effectiveDate: 1681397289346,
      managerFlag: false,
      eventHosterFlag: true,
      hostFlag: false,
      createPublicEventFlag: false,
    },
    {
      id: 12,
      fullname: 'Cao Xuân Hải',
      email: 'ryancao1811@gmail.com',
      address: ' TT. Nhà Bè, Nhà Bè, Thành phố Hồ Chí Minh',
      imagePath:
        'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
      effectiveDate: 1681397385021,
      managerFlag: false,
      eventHosterFlag: false,
      hostFlag: false,
      createPublicEventFlag: false,
    },
    {
      id: 13,
      fullname: 'Nguyễn Duy Khang',
      email: 'khangnguyen151001@gmail.com',
      address: ' TT. Nhà Bè, Nhà Bè, Thành phố Hồ Chí Minh',
      imagePath:
        'https://res.cloudinary.com/dzri3e9wa/image/upload/v1667315212/email-teamplate/default-male-image_cgjs2b.png',
      effectiveDate: 1681397599857,
      managerFlag: true,
      eventHosterFlag: true,
      hostFlag: false,
      createPublicEventFlag: false,
    },
  ];
  // resourceType: ResourceBasicInfo[] = [];
  // resourceRoom: ResourceDetail[] = [];
  // resourceSupportDevice: ResourceDetail[] = [];
  // resourcePeople: UserBusinessDetail[] = [];
  selectedResourceTypeValue: string[] = [];
  selectedResourceRoom: ResourceDetail[] = [];
  selectedResourceDevice: ResourceDetail[] = [];
  selectedResourcePeople: UserBusinessDetail[] = [];
  isSelectRoom: boolean = false;
  isSelectDevice: boolean = false;
  isSelectPeople: boolean = false;
  selectedResourceFormControl = new FormControl();
  selectedResourceTypeFormControl = new FormControl();
  tooltipSelectedResources: string = '';
  upcomingEvents: EventDetail[] = [];
  pendingEvents: EventDetail[] = [];
  cancelEvents: EventDetail[] = [];
  // previousEvents: any[] = [
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 1682295394786,
  //     endTime: 1682295394786,
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  //   {
  //     id: 2,
  //     hostFlag: true,
  //     hostName: 'Nguyen Minh Dang 2',
  //     organizationName: '',
  //     eventName: 'This is event title',
  //     startTime: 'Monday, April 24, 2023 7:16:34.786 AM',
  //     endTime: 'Monday, April 24, 2023 8:16:34.786 AM',
  //     eventStatus: 'PENDING',
  //     sendEmailFlag: true,
  //     appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
  //     reason: '',
  //   },
  // ];
  previousEvents: EventDetail[] = [];
  isShowingBookSidenav: boolean = false;
  isShowingConfirmBookSidenav: boolean = false;
  weekdays: DateBookingSlot[] = [];
  indexSelectedWeekday: number = 0;
  eventDurationFormControl = new FormControl('30 minutes');
  eventDuration: string = '';
  bookingSlots: BookingSlot[] = [];
  indexSelectedBookingSlot: number = 0;
  constructor(
    private resourceService: DeviceService,
    private eventService: EventService,
    private toastrService: ToastrService,
    private organizationService: OrganizationService,
    private bottomSheetBookingConfirm: MatBottomSheet,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this._getResourceType();
    this._getAllResources();
    this._getAllUserInOrganization();
    this._getEventList();
    // this.previousEvents.forEach((element: any, index: number) => {
    //   this.previousEvents[index] = new EventDetail(element);
    //   debugger;
    // });
  }

  _getResourceType() {
    try {
      this.resourceService
        .getResourceType()
        .subscribe((response: ApiResponse<ResourceBasicInfo[]>) => {
          if (response.statusCode === 200) {
            this.resourceType = response.data;
          } else {
            this.toastrService.error(
              'Error in getting resources type',
              'ERROR'
            );
          }
        });
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting resources type', 'ERROR');
    }
  }

  _getAllResources() {
    try {
      const requestBody: SearchResourceRequestBody = {
        approverFullName: '',
        code: '',
        description: '',
        location: '',
        name: '',
      };
      this.resourceService
        .getAllResources(requestBody)
        .subscribe(
          (response: ApiResponse<DataListResponse<ResourceDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element, index) => {
                if (
                  element.deviceType != null &&
                  element.deviceType === 'ROOM'
                ) {
                  this.resourceRoom.push(element);
                } else if (
                  element.deviceType != null &&
                  element.deviceType === 'DEVICE'
                ) {
                  this.resourceSupportDevice.push(element);
                }
              });
            } else {
              debugger;
              this.toastrService.error('Error in getting resources', 'ERROR');
            }
          }
        );
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting resources', 'ERROR');
    }
  }

  _getAllUserInOrganization() {
    try {
      this.organizationService
        .getUserInOrganization()
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element) => {
                if (element.fullname != 'User Default') {
                  this.resourcePeople.push(element);
                }
              });
            } else {
              debugger;
              this.toastrService.error('Error in getting users', 'ERROR');
            }
          }
        );
    } catch (error) {
      debugger;
      this.toastrService.error('Error in getting users', 'ERROR');
    }
  }

  onResourceTypeSelectChangeAction(event: any) {
    this.isSelectRoom = false;
    this.isSelectDevice = false;
    this.isSelectPeople = false;
    this.selectedResourceTypeFormControl.value.forEach((element: any) => {
      if (element === 'Meeting Room') {
        this.selectedResourceRoom = this.resourceRoom;
        this.isSelectRoom = true;
      }
      if (element === 'Person') {
        this.selectedResourcePeople = this.resourcePeople;
        this.isSelectPeople = true;
      }
      if (element === 'Support Device') {
        this.selectedResourceDevice = this.resourceSupportDevice;
        this.isSelectDevice = true;
      }
    });
  }

  onResourceSelectionChangeAction(event: any) {
    if (this.selectedResourceFormControl.value?.length > 2) {
      const tempTooltipContent: string[] = [];
      this.selectedResourceFormControl.value
        .slice(2)
        .forEach((element: any) => {
          if (element.deviceType != null) tempTooltipContent.push(element.name);
          else tempTooltipContent.push(element.fullname);
        });
      this.tooltipSelectedResources = tempTooltipContent.join(', ');
    }
  }

  _getEventList() {
    try {
      let defaultPage: number = 0;
      let defaultSize: number = 100;
      let currentDate: Date = new Date();
      let nextYearDate: Date = new Date(
        currentDate.getFullYear() + 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      let lastYearDate: Date = new Date(
        currentDate.getFullYear() - 1,
        currentDate.getMonth(),
        currentDate.getDate()
      );
      let defaultStartDate: string = lastYearDate.toISOString();
      let defaultEndDate: string = nextYearDate.toISOString();

      let requestBody: EventSearchRequest = {
        endTime: defaultEndDate,
        eventDescription: '',
        eventName: '',
        hostName: '',
        partnerName: '',
        startTime: defaultStartDate,
      };
      this.eventService
        .getEventList(requestBody, defaultPage, defaultSize)
        .subscribe(
          (response: ApiResponse<DataListResponse<EventDetail[]>>) => {
            if (response.statusCode === 200) {
              response.data.content.forEach((element: any) => {
                const event: EventDetail = new EventDetail(element);
                this.previousEvents.push(event);
              });
            }
          },
          (error: CustomError) => {
            debugger;
            // this.toastrService.error('Error in getting events', 'ERROR');
          }
        );
    } catch (error) {
      debugger;
      // this.toastrService.error('Error in getting events', 'ERROR');
    }
  }

  triggerBookingSidenav() {
    if (this.weekdays.length > 0) {
      if (this.weekdays[this.indexSelectedWeekday])
        this.weekdays[this.indexSelectedWeekday].selectFlag = false;
      this.indexSelectedWeekday = 0;
      this.weekdays[0].selectFlag = true;
    } else {
      const currentDate: Date = new Date();
      for (let i = 0; i < 7; i++) {
        let dateFormat = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + i
        );
        const weekday: DateBookingSlot = {
          code: dateFormat.toLocaleString('en-US', { weekday: 'short' }),
          day:
            dateFormat.getDate() < 10
              ? `0${dateFormat.getDate()}`
              : `${dateFormat.getDate()}`,
          date_ddmmyy: Utils.convertFromDatetoDDMMYY(dateFormat),
          date: dateFormat,
          selectFlag: false,
        };
        this.weekdays.push(weekday);
        this.weekdays[this.indexSelectedWeekday].selectFlag = true;
      }
    }
    this._getBookingSlots(0);
    if (this.isShowingBookSidenav == false) this.isShowingBookSidenav = true;
  }
  closeBookingSidenav() {
    if (this.isShowingBookSidenav) this.isShowingBookSidenav = false;
  }
  dateSelect(index: number) {
    if (this.weekdays[this.indexSelectedWeekday])
      this.weekdays[this.indexSelectedWeekday].selectFlag = false;
    this.indexSelectedWeekday = index;
    this.weekdays[this.indexSelectedWeekday].selectFlag = true;
    if (this.bookingSlots.length > 0) {
      this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = false;
    }
    this.isShowingConfirmBookSidenav = true;
  }

  onSelectionChangeEventDuration() {
    debugger;
  }

  _getBookingSlots(index: number) {
    // try {
    //   //Handle Duration
    //   let eventDuration: number = 0;
    //   let match =
    //     this.eventDurationFormControl.value!.match(/^\d+(?= minutes)/);
    //   if (match) eventDuration = parseInt(match[0]);
    //   //Handle Time
    //   let selectedDate: Date = new Date(this.weekdays[index].date);
    //   let fromDate: string = '';
    //   if (index == 0) {
    //     let currentDate: Date = new Date();
    //     currentDate.setMinutes(Math.ceil(currentDate.getMinutes() / 60) * 60);
    //     currentDate.setSeconds(1);
    //     currentDate.setMilliseconds(0);
    //     fromDate = currentDate.toISOString();
    //   } else {
    //     selectedDate.setHours(0);
    //     selectedDate.setMinutes(0);
    //     fromDate = selectedDate.toISOString();
    //   }
    //   selectedDate.setHours(23);
    //   selectedDate.setMinutes(59);
    //   let toDate: string = selectedDate.toISOString();
    //   //Handle Resource
    //   const listDeviceId: number[] = [];
    //   const listPartnerId: number[] = [];
    //   this.selectedResourceFormControl.value.forEach((element: any) => {
    //     if (element.deviceType != null) listDeviceId.push(element.id);
    //     else listPartnerId.push(element.id);
    //   });
    //   //Handle Request
    //   let requestBody: BookingSlotRequest = {
    //     eventDuration: eventDuration,
    //     freeScheduleFlag: false,
    //     fromDate: fromDate,
    //     toDate: toDate,
    //     listDeviceId: listDeviceId,
    //     listPartnerId: listPartnerId,
    //   };
    //   debugger;
    //   this.eventService
    //     .getBookingSlots(requestBody)
    //     .subscribe((response: ApiResponse<ScheduleDatas>) => {
    //       debugger;
    //       if (response.statusCode === 200) {
    //         const tempBookingSlots: BookingSlot[] = [];
    //         response.data.scheduleDatas[0].timeDatas.forEach(
    //           (element: TimeData) => {
    //             const bookingSlot: BookingSlot = {
    //               selectFlag: false,
    //               timeDatas: element,
    //             };
    //             tempBookingSlots.push(bookingSlot);
    //           }
    //         );
    //         this.bookingSlots = tempBookingSlots;
    //       } else {
    //         debugger;
    //       }
    //     });
    // } catch (error) {
    //   debugger;
    //   if (this.selectedResourceFormControl.value == null) {
    //     this.toastrService.warning(
    //       'Please select resource for booking request.',
    //       'WARNING'
    //     );
    //   }
    // }
  }

  onSelectBookingSlotClicked(index: number) {
    this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = false;
    this.indexSelectedBookingSlot = index;
    this.bookingSlots[this.indexSelectedBookingSlot].selectFlag = true;
    //Open the bottom sheet to handle the confirmation
    // this.bottomSheetBookingConfirm.open(BottomSheetComponent);
  }
}
