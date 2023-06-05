import { Component, OnInit, Optional } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResourceDetail, SearchDevice } from 'src/app/_models/resource';
import { ScheduleData } from 'src/app/_models/schedule';
import { DeviceService } from 'src/app/_services/resource.service';
import { FormControl } from '@angular/forms';
import { UserBusinessDetail, UserProfile } from 'src/app/_models/user';
import { OrganizationService } from 'src/app/_services/organization.service';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import Utils from 'src/app/_utils/utils';
import { Router } from '@angular/router';
import { ResourceCalendarComponent } from '../../calendar/resource-calendar/resource-calendar.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  deviceCalendarData: ScheduleData[] = [];
  role: string = '';
  deviceListDisplayed: ResourceDetail[] = [];
  roomList: ResourceDetail[] = [];
  televisionList: ResourceDetail[] = [];
  desktopList: ResourceDetail[] = [];
  allDeviceList: ResourceDetail[] = [];
  isOpenDeviceDetail: boolean = false;
  intialAsignee: UserBusinessDetail = {
    id: 0,
    fullname: '',
    email: '',
    address: '',
    imagePath: '',
    effectiveDate: undefined,
    managerFlag: false,
    eventHosterFlag: false,
    hostFlag: false,
    createPublicEventFlag: false,
    scheduleName: '',
  };
  selectedResourceType: FormControl = new FormControl();
  selectedAssignee: FormControl = new FormControl();
  listEmployee: UserBusinessDetail[] = [];
  currentSelectedDevice: ResourceDetail = {
    id: -1,
    code: '',
    name: '',
    location: '',
    description: '',
    imagePath: '',
    deviceType: '',
    enable: true,
    deviceDefaultFlag: false,
    approverFullName: '',
  };
  currentSelectedDeviceIndex: number = -1;
  constructor(
    private deviceService: DeviceService,
    private toastrService: ToastrService,
    private organizationService: OrganizationService,
    private router: Router,
    @Optional() private dialog: MatDialog
  ) {
    this.selectedAssignee.setValue(this.intialAsignee);
  }

  ngOnInit(): void {
    // this.role = this.storageService.getRole();
    this.selectedResourceType.setValue('all-resources');
    this._getAllDevicesOfOrganization();
    this._getAllUserInOrganization();
    // this._getDeviceCalendarData();
  }
  // async _getAllDevicesOfOrganization() {
  //   try {
  //     let responseData: any =
  //       await this.deviceService.getAllDevicesOfOrganization();
  //     if (responseData.statusCode === 200) {
  //       responseData.data.content.shift();
  //       this.devices = responseData.data.content;
  //     } else {
  //       this.toastrService.error(
  //         'Cannot find any resource of your organization',
  //         'ERROR'
  //       );
  //     }
  //   } catch (error) {
  //     debugger;
  //     this.toastrService.error(
  //       'Cannot find any resource of your organization',
  //       'ERROR'
  //     );
  //   }
  // }
  async _getDeviceCalendarData() {
    try {
      let responseData: any = await this.deviceService.viewDetailCalendar();
      if (responseData.statusCode === 200) {
        this.deviceCalendarData = responseData.data.scheduleDatas.filter(
          (element: ScheduleData) => element.timeDatas.length > 0
        );
      } else {
      }
    } catch (error) {
      debugger;
    }
  }
  _getAllDevicesOfOrganization() {
    const requestBody: SearchDevice = {
      approverFullName: '',
      code: '',
      description: '',
      location: '',
      name: '',
    };
    try {
      this.deviceService
        .getAllResources(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.allDeviceList = response.data.content;
            this.deviceListDisplayed = this.allDeviceList;
            response.data.content.forEach((element: ResourceDetail) => {
              if (element.deviceType === 'ROOM') this.roomList.push(element);
              else if (element.deviceType === 'DEVICE') {
                const televisionPattern = new RegExp('Television');
                const desktopPattern = new RegExp('Desktop');
                const isTelevisionFlag = televisionPattern.test(element.name);
                const isDesktopFlag = desktopPattern.test(element.name);
                if (isTelevisionFlag) {
                  this.televisionList.push(element);
                } else if (isDesktopFlag) {
                  this.desktopList.push(element);
                }
              }
            });
          }
        });
    } catch (error: any) {
      debugger;
      this.toastrService.error(
        'Cannot find any resource of your organization',
        'ERROR'
      );
    }
  }

  onDeviceClick(deviceDisplayed: ResourceDetail, index: number) {
    this.currentSelectedDeviceIndex = index;
    if (!this.isOpenDeviceDetail) {
      this.currentSelectedDevice = deviceDisplayed;
      const indexFindEmail: number = this.listEmployee.findIndex(
        (item) => item.email === this.currentSelectedDevice.approverEmail ?? ''
      );
      if (indexFindEmail != -1)
        this.selectedAssignee.setValue(this.listEmployee[indexFindEmail]);
      this.isOpenDeviceDetail = !this.isOpenDeviceDetail;
    }
  }
  onCloseSidenav() {
    if (this.isOpenDeviceDetail) {
      this.isOpenDeviceDetail = !this.isOpenDeviceDetail;
    }
  }
  onSelectResourceTypeSelection() {
    const resourceType: string = this.selectedResourceType.value;
    if (resourceType === 'all-resources') {
      this.deviceListDisplayed = this.allDeviceList;
    } else if (resourceType === 'room') {
      this.deviceListDisplayed = this.roomList;
    } else if (resourceType === 'television') {
      this.deviceListDisplayed = this.televisionList;
    } else if (resourceType === 'desktop') {
      this.deviceListDisplayed = this.desktopList;
    }
  }

  _getAllUserInOrganization() {
    try {
      this.organizationService
        .getUserInOrganization()
        .subscribe(
          (response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
            if (response.statusCode === 200) {
              const index = response.data.content.findIndex(
                (item) => item.fullname === 'User Default'
              );
              response.data.content.splice(index, 1);
              this.listEmployee = response.data.content;
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

  _updateApprover() {
    const approverId: number = this.selectedAssignee.value.id;
    const deviceId: number = this.currentSelectedDevice.id;
    this.deviceService
      .updateApprover(approverId, deviceId)
      .subscribe((response: ApiResponse<ResourceDetail>) => {
        if (response.statusCode === 200) {
          this.currentSelectedDevice = response.data;
          // const index: number = this.listEmployee.findIndex(
          //   (item) => item.email === this.currentSelectedDevice.approverEmail
          // );
          // this.selectedAssignee.setValue(this.listEmployee[index]);
          this.deviceListDisplayed[
            this.currentSelectedDeviceIndex
          ].approverFullName = response.data.approverFullName ?? '';
          this.toastrService.success(
            'Update Approver For Device Successfully',
            'SUCCESS',
            Utils.toastrConfig
          );
        }
      });
  }
  navigateToApproveDashboard() {
    this.router.navigateByUrl('/homepage/device/approve-dashboard');
  }
  viewResourceCalendar() {
    const dialogRef = this.dialog.open(ResourceCalendarComponent, {
      width: '1200px',
      height: '680px',
      data: {
        id: this.currentSelectedDevice.id,
        resourceType: 'device',
      },
    });
  }
}
