import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { throwError } from 'rxjs';
import { ActiveCalendar } from '../_models/active-calendar';
import {
  AssignScheduleRequestBody,
  ModifyScheduleRequest,
  Schedule,
  ScheduleResponse,
} from '../_models/schedule';
// import { EventInput } from '@fullcalendar/angular';
import { PaginatedResult } from '../_models/pagination';
import Utils from '../_utils/utils';
import { ApiResponse, CustomError } from '../_models/response';

const requestHeader = new HttpHeaders({ 'No-Auth': 'True' });

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  paginatedResult: PaginatedResult<ScheduleResponse[]> = new PaginatedResult<
    ScheduleResponse[]
  >();

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) {}

  // Create default schedule for member (by manager)
  createDefaultSchedule(requestBody: Schedule) {
    return this.http
      .post(Utils.ORGANIZATION_API + '/schedule/user/add', requestBody)
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  create(requestData: Schedule): Observable<any> {
    return this.http.post(Utils.SCHEDULE_API + '/add', requestData).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getListSchedules(): Observable<any> {
    return this.http.get(Utils.SCHEDULE_API + '/list').pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getListSchedulesPagination(page: number, size: number): Observable<any> {
    return this.http
      .get(`${Utils.SCHEDULE_API}/list/?page=${page}&size=${size}`)
      .pipe(
        map((response: any) => {
          this.paginatedResult.result = response.data.content;
          this.paginatedResult.pagination = {
            pageNumber: response.data.pageable.pageNumber,
            pageSize: response.data.pageable.pageSize,
            totalElements: response.data.totalElements,
            totalPages: response.data.totalPages,
          };
          return this.paginatedResult;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  getScheduleDetail(id: any) {
    return this.http.get(Utils.SCHEDULE_API + '/detail/' + id).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  getCalendarPublic(pathMapping: string, fromDate: string, toDate: string) {
    return this.http
      .get(
        Utils.PUBLIC_API +
          '/calendar-info/' +
          `${pathMapping}` +
          `?fromDate=${fromDate}&toDate=${toDate}`
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  async getScheduleDetailPromise(id: any) {
    try {
      const requestApi = `${Utils.SCHEDULE_API}/detail/${id}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  getActiveCalendar() {
    return this.http
      .get(
        Utils.SCHEDULE_API +
          '/calendar-info' +
          '?fromDate=2022-11-01&toDate=2022-12-01'
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  updateCalendar(requestBody: ModifyScheduleRequest) {
    return this.http.put(Utils.SCHEDULE_API + '/edit', requestBody).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  async getActiveCalendarUsingPromise(
    fromDate: string,
    toDate: string
  ): Promise<any> {
    try {
      const requestApi = `${Utils.SCHEDULE_API}/calendar-info/?fromDate=${fromDate}&toDate=${toDate}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  async getPublicCalendarUsingPromise(
    pathMapping: string,
    fromDate: string,
    toDate: string
  ): Promise<any> {
    try {
      const requestApi = `${Utils.PUBLIC_API}/calendar-info/${pathMapping}?fromDate=${fromDate}&toDate=${toDate}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  async getPublicFreeTimeUsingPromise(
    pathMapping: string,
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ): Promise<any> {
    try {
      const requestApi = `${Utils.PUBLIC_API}/calendar-info/${pathMapping}?fromDate=${fromDate}&toDate=${toDate}&freeScheduleFlag=${freeScheduleFlag}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  async getFreeTimeSlotsPromise(
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ): Promise<any> {
    try {
      const requestApi = `${Utils.SCHEDULE_API}/calendar-info/?fromDate=${fromDate}&toDate=${toDate}&freeScheduleFlag=${freeScheduleFlag}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  async getComparedCalendarPromise(
    pathMapping: string,
    fromDate: string,
    toDate: string,
    freeScheduleFlag: boolean
  ): Promise<any> {
    try {
      const requestApi = `${Utils.SCHEDULE_API}/compare-with-my-calendar/${pathMapping}?fromDate=${fromDate}&toDate=${toDate}&freeScheduleFlag=${freeScheduleFlag}`;
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } catch (error) {
      return 'error';
    }
  }

  asyncGoogleCalendar(code: string) {
    return this.http
      .get(
        `${Utils.SCHEDULE_API}/sync-google-calendar?authorizationCode=${code}&redirectUri=${Utils.CALLBACK_AUTH_SYNC}`
      )
      .pipe(
        map((response: any) => {
          debugger;
          return response;
        }),
        catchError((err) => {
          debugger;
          return err;
        })
      );
  }

  async viewDefaultCalendarUser(
    freeScheduleFlag: boolean,
    fromDate: string,
    toDate: string
  ) {
    try {
      const request = `${Utils.ORGANIZATION_API}/schedule/view-default-calendar-for-user?freeScheduleFlag=${freeScheduleFlag}&fromDate=${fromDate}&toDate=${toDate}`;
      const response = await lastValueFrom(this.http.get(request));
      return response;
    } catch (error) {
      debugger;
      return 'error';
    }
  }

  async getCalendarUserBusiness() {
    try {
      const request = `${Utils.ORGANIZATION_API}/schedule/get-default-schedule-for-user`;
      const response = await lastValueFrom(this.http.get(request));
      return response;
    } catch (error) {
      debugger;
      return 'error';
    }
  }
}
