import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceBorrowRequest, socketRequest } from 'src/app/_models/request';
import { ApiResponse, DataListResponse } from 'src/app/_models/response';
import { OrganizationService } from 'src/app/_services/organization.service';
import { DeviceService } from 'src/app/_services/resource.service';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-approve-dashboard',
  templateUrl: './approve-dashboard.component.html',
  styleUrls: ['./approve-dashboard.component.scss'],
})
export class ApproveDashboardComponent implements OnInit {
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  displayedColumns: string[] = [
    'event-name',
    // 'device-code',
    'device-name',
    // 'requester-name',
    'requester-email',
    'date',
    'time',
    'borrow-state',
    'approval',
  ];
  listRequests: DeviceBorrowRequest[] = [];
  numberOfRequests: number = 0;
  public dataSourceRequests!: MatTableDataSource<DeviceBorrowRequest>;
  constructor(
    private socketService: SocketService,
    private toastrService: ToastrService,
    private resourceService: DeviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDeviceBorrowRequest(this.defaultPageIndex, this.defaultPageSize);
  }

  getDeviceBorrowRequest(pageIndex: number, size: number) {
    try {
      const sortCondition: string = 'id,DESC';
      this.resourceService
        .getDeviceRequestList(pageIndex, size, sortCondition)
        .subscribe(
          (response: ApiResponse<DataListResponse<DeviceBorrowRequest[]>>) => {
            if (response.statusCode === 200) {
              this.numberOfRequests = response.data.numberOfElements;
              const requestList: DeviceBorrowRequest[] = [];
              response.data.content.forEach((element) => {
                const request = new DeviceBorrowRequest(element);
                requestList.push(request);
              });
              this.listRequests = requestList;
              this.dataSourceRequests =
                new MatTableDataSource<DeviceBorrowRequest>(this.listRequests);
            } else {
              debugger;
            }
          }
        );
    } catch (error) {
      debugger;
    }
  }
  pageChanged(event: PageEvent) {
    this.getDeviceBorrowRequest(event.pageIndex, this.defaultPageSize);
  }

  onNavigateBackToDeviceDashboard() {
    this.router.navigateByUrl('/homepage/device');
  }
  onClickApproveOrDeny(element: DeviceBorrowRequest, approveFlag: boolean) {
    const _approveFlag: boolean = approveFlag;
    const borrowDeviceId: number = element.borrowId;
    element.borrowState = 'ACCEPT';
    try {
      this.resourceService
        .approveOrDenyBorrowDeviceRequest(_approveFlag, borrowDeviceId)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.toastrService.success(
              `${element.deviceName} has been approved successfully for the ${element.eventName}`,
              'SUCCESS'
            );
            const indexElement = this.listRequests.findIndex(
              (item) => item.borrowId == element.borrowId
            );
            this.listRequests[indexElement].borrowState = 'ACCEPT';
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
