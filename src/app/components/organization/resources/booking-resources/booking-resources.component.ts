import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventDetail } from 'src/app/_models/event';
import { SearchResourceRequestBody } from 'src/app/_models/request';
import { ResourceBasicInfo, ResourceDetail } from 'src/app/_models/resource';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import { UserBusinessDetail } from 'src/app/_models/user';
import { OrganizationService } from 'src/app/_services/organization.service';
import { DeviceService } from 'src/app/_services/resource.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-booking-resources',
  templateUrl: './booking-resources.component.html',
  styleUrls: ['./booking-resources.component.scss'],
})
export class BookingResourcesComponent implements OnInit {
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
  // upcomingEvents: EventDetail[] = [];
  upcomingEvents: EventDetail[] = [
    {
      id: 2,
      hostFlag: true,
      hostName: 'Nguyen Minh Dang 2',
      organizationName: null,
      eventName: 'This is event title',
      startTime: 1682295394786,
      endTime: 1682298994786,
      eventStatus: 'PENDING',
      sendEmailFlag: true,
      appointmentUrl: 'https://meet.google.com/vjw-nzto-oyo',
      reason: null,
    },
  ];
  pendingEvents: EventDetail[] = [];
  cancelEvents: EventDetail[] = [];
  previousEvents: EventDetail[] = [];
  constructor(
    private resourceService: DeviceService,
    private toastrService: ToastrService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    // this._getResourceType();
    // this._getAllResources();
    // this._getAllUserInOrganization();
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
}
