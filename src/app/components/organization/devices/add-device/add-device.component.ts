import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ResourceDetail } from 'src/app/_models/resource';
import { ScheduleData } from 'src/app/_models/schedule';
import { DeviceService } from 'src/app/_services/resource.service';
import { LocalStorageService } from 'src/app/_services/local-storage.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss'],
})
export class AddDeviceComponent implements OnInit {
  deviceCalendarData: ScheduleData[] = [];
  role: string = '';
  devices: ResourceDetail[] = [];
  constructor(
    private deviceService: DeviceService,
    private toastrService: ToastrService,
    private storageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.role = this.storageService.getRole();
    this._getAllDevicesOfOrganization();
    // this._getDeviceCalendarData();
  }
  async _getAllDevicesOfOrganization() {
    try {
      let responseData: any =
        await this.deviceService.getAllDevicesOfOrganization();
      if (responseData.statusCode === 200) {
        responseData.data.content.shift();
        this.devices = responseData.data.content;
      } else {
        this.toastrService.error(
          'Cannot find any resource of your organization',
          'ERROR'
        );
      }
    } catch (error) {
      debugger;
      this.toastrService.error(
        'Cannot find any resource of your organization',
        'ERROR'
      );
    }
  }
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
}
