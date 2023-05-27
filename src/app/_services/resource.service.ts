import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Utils from '../_utils/utils';
import { Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import { ApiResponse, CustomError } from '../_models/response';
import { ResourceBasicInfo, SearchDevice } from '../_models/resource';
import { DataListResponse } from '../_models/response';
import { ResourceDetail } from '../_models/resource';
import { DeviceBorrowRequest } from '../_models/request';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private http: HttpClient) {}

  getResourceType(): Observable<ApiResponse<ResourceBasicInfo[]>> {
    return this.http
      .get<ApiResponse<ResourceBasicInfo[]>>(`${Utils.DEVICE_API}/enum`)
      .pipe(
        map((response: ApiResponse<ResourceBasicInfo[]>) => {
          return response;
        }),
        catchError((error: any) => {
          // handle error
          debugger;
          return throwError(error);
        })
      );
  }

  getAllResources(
    requestBody: SearchDevice,
    offset?: number,
    pageNumber?: number,
    pageSize?: number,
    paged?: boolean,
    sorted?: boolean,
    unsorted?: boolean,
    unpaged?: boolean
  ): Observable<ApiResponse<DataListResponse<ResourceDetail[]>>> {
    // const requestUrl = `${Utils.ORGANIZATION_API}/device/get-all-device-of-organization?offset=${offset}&pageNumber=${pageNumber}&pageSize=${pageSize}&paged=${paged}&sort.sorted=${sorted}&sort.unsorted=${unsorted}&unpaged=${unsorted}`;
    const requestUrl = `${Utils.ORGANIZATION_API}/device/get-all-device-of-organization?sort=id,asc`;
    return this.http
      .post<ApiResponse<DataListResponse<ResourceDetail[]>>>(
        requestUrl,
        requestBody
      )
      .pipe(
        map((response: ApiResponse<DataListResponse<ResourceDetail[]>>) => {
          return response;
        }),
        catchError((error: any) => {
          // handle error
          debugger;
          return throwError(error);
        })
      );
  }

  async viewDeviceDetail(username: string) {
    debugger;
    let requestBody = {
      username: username,
    };
    try {
      const requestUrl = `${Utils.DEVICE_API}/detail/4`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      debugger;
      return response.data;
    } catch (error) {
      debugger;
      return 'get device detail error';
    }
  }

  async viewDetailCalendar() {
    try {
      const requestUrl = `${Utils.ORGANIZATION_API}/schedule/view-default-calendar-for-device/4?freeScheduleFlag=false&fromDate=2023-04-11&toDate=2023-04-23`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      debugger;
      return 'get device calendar error';
    }
  }

  async getAllDevicesOfOrganization(
    offset?: number,
    pageNumber?: number,
    pageSize?: number,
    paged?: boolean,
    sorted?: boolean,
    unsorted?: boolean,
    unpaged?: boolean
  ) {
    try {
      // const requestUrl = `${Utils.ORGANIZATION_API}/device/get-all-device-of-organization?offset=${offset}&pageNumber=${pageNumber}&pageSize=${pageSize}&paged=${paged}&sort.sorted=${sorted}&sort.unsorted=${unsorted}&unpaged=${unsorted}`;
      const requestUrl = `${Utils.ORGANIZATION_API}/device/get-all-device-of-organization?offset=<long>&pageNumber=<integer>&pageSize=<integer>&paged=<boolean>&sort.sorted=<boolean>&sort.unsorted=<boolean>&unpaged=<boolean>`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      debugger;
      return 'get device list error';
    }
  }
  updateApprover(approverAccountId: number, deviceId: number): Observable<any> {
    const requestBody: any = {
      approverAccountId: approverAccountId,
      deviceId: deviceId,
    };
    const requestUrl: string = `${Utils.ORGANIZATION_API}/device/change-approver`;
    return this.http
      .put<ApiResponse<ResourceDetail>>(requestUrl, requestBody)
      .pipe(
        map((response: ApiResponse<ResourceDetail>) => {
          if (response.statusCode === 200) {
            return response;
          } else {
            return new CustomError(response.errors);
          }
        }),
        catchError((error: any) => {
          return throwError(CustomError);
        })
      );
  }

  getDeviceRequestList(
    page: number,
    size: number,
    sortCondition: string
  ): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/device/get-all-device-borrow-request?offset=100&page=${page}&pageNumber=0&pageSize=0&size=${size}&paged=true&unpaged=false&sort=${sortCondition}&sort.sorted=true&sort.unsorted=false`;
    return this.http
      .get<ApiResponse<DataListResponse<DeviceBorrowRequest[]>>>(requestUrl)
      .pipe(
        map(
          (response: ApiResponse<DataListResponse<DeviceBorrowRequest[]>>) => {
            if (response.statusCode === 200) {
              return response;
            } else {
              return new CustomError(response.errors);
            }
          }
        ),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  approveOrDenyBorrowDeviceRequest(
    approveFlag: boolean,
    borrowDeviceId: number
  ): Observable<any> {
    const requestBody: any = {
      approveFlag: approveFlag,
      borrowDeviceId: borrowDeviceId,
    };
    const requestUrl = `${Utils.ORGANIZATION_API}/device/approve-or-deny-device`;
    return this.http.put<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) {
          return response;
        } else {
          return new CustomError(response.errors);
        }
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
