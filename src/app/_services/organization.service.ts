import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import Utils from '../_utils/utils';
import {
  ApiResponse,
  CustomError,
  DataListResponse,
} from '../_models/response';
import { UserBusinessDetail } from '../_models/user';
import {
  AssignedPermission,
  OrganizationDetails,
} from '../_models/organization';
import {
  AssignScheduleRequestBody,
  ScheduleDatas,
  ScheduleResponse,
} from '../_models/schedule';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}
  createOrganization(requestBody: any): Observable<any> {
    return this.http.post(`${Utils.ORGANIZATION_API}/add`, requestBody).pipe(
      map((response: any) => {
        if (response.statusCode == 200) {
          return response;
        }
      }),
      catchError((err) => {
        debugger;
        return 'create organization error';
      })
    );
  }
  async getOrganizationDetailPromise() {
    try {
      const requestUrl = `${Utils.ORGANIZATION_API}/detail`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      return 'get organization detail error';
    }
  }

  addEmployee(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .post(`${Utils.ORGANIZATION_API}/user/upload`, formData)
      .pipe(
        map((response: any) => {
          if (response.statusCode == 200) {
            return response;
          }
        }),
        catchError((err) => {
          debugger;
          return 'add employee error';
        })
      );
  }

  async getEmployee() {
    try {
      const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=10&pageNumber=10&pageSize=10&paged=true&sort.sorted=true&sort.unsorted=false&unpaged=false`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      debugger;
      return 'get employee detail error';
    }
  }

  getUserInOrganization(
    offset?: number,
    page?: number,
    pageNumber?: number,
    pageSize?: number,
    size?: number,
    sorted?: boolean,
    unsorted?: boolean,
    paged?: boolean,
    unpaged?: boolean
  ): Observable<ApiResponse<DataListResponse<UserBusinessDetail[]>>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=${offset}&page=${page}&pageNumber=${pageNumber}&pageSize=${pageSize}&size=${size}&paged=${paged}&unpaged=${unpaged}&sort.sorted=${sorted}&sort.unsorted=${unsorted}`;
    // const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=10&pageNumber=10&pageSize=10&paged=true&sort.sorted=true&sort.unsorted=false&unpaged=false`;
    return this.http
      .get<ApiResponse<DataListResponse<UserBusinessDetail[]>>>(requestUrl)
      .pipe(
        map((response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  getOrganizationDetail(): Observable<ApiResponse<OrganizationDetails>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/detail`;
    return this.http.get<ApiResponse<OrganizationDetails>>(requestUrl).pipe(
      map((response: ApiResponse<OrganizationDetails>) => {
        return response;
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  getOrganizationDefaultCalendar(
    offset?: number,
    pageNumber?: number,
    pageSize?: number,
    paged?: boolean,
    sorted?: boolean,
    unsorted?: boolean,
    unpaged?: boolean
  ): Observable<ApiResponse<DataListResponse<ScheduleResponse[]>>> {
    // const requestUrl = `${Utils.ORGANIZATION_API}/schedule/list?offset=${offset}&pageNumber=${pageNumber}&pageSize=${pageSize}&paged=${paged}&sort.sorted=${sorted}&sort.unsorted=${unsorted}&unpaged=${unsorted}`;
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/list`;
    return this.http
      .get<ApiResponse<DataListResponse<ScheduleResponse[]>>>(requestUrl)
      .pipe(
        map((response: ApiResponse<DataListResponse<ScheduleResponse[]>>) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
  assignSchedule(
    requestBody: AssignScheduleRequestBody
  ): Observable<ApiResponse<boolean>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/assign-schedule-for-user-and-device`;
    return this.http.post<ApiResponse<boolean>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<boolean>) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(CustomError);
      })
    );
  }

  viewActiveCalendar(
    userId: number,
    freeScheduleFlag: boolean,
    fromDate: string,
    toDate: string
  ): Observable<ApiResponse<ScheduleDatas>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/view-default-calendar-for-user/${userId}?freeScheduleFlag=${freeScheduleFlag}&fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<ApiResponse<ScheduleDatas>>(requestUrl).pipe(
      map((response: ApiResponse<ScheduleDatas>) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(CustomError);
      })
    );
  }

  getUserScheduleById(
    userId: number
  ): Observable<ApiResponse<ScheduleResponse>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/get-default-schedule-for-user/${userId}`;
    return this.http.get<ApiResponse<ScheduleResponse>>(requestUrl).pipe(
      map((response: ApiResponse<ScheduleResponse>) => {
        return response;
      }),
      catchError((error: any) => {
        return throwError(CustomError);
      })
    );
  }
  assignAuthority(requestBody: AssignedPermission): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/user/edit`;
    return this.http
      .put<ApiResponse<AssignedPermission>>(requestUrl, requestBody)
      .pipe(
        map((response: ApiResponse<AssignedPermission>) => {
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
}
