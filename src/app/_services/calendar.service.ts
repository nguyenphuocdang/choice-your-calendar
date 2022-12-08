import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { throwError } from 'rxjs';
import { ActiveCalendar } from '../_models/active-calendar';
import { Schedule, ScheduleResponse } from '../_models/schedule';
import { EventInput } from '@fullcalendar/angular';
import { PaginatedResult } from '../_models/pagination';

const PUBLIC_API = 'http://localhost:8000/api/public/schedule';
const SCHEDULE_API = 'http://localhost:8000/api/schedule';
const requestHeader = new HttpHeaders(
  {'No-Auth': 'True'},
)

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  paginatedResult: PaginatedResult<ScheduleResponse[]> = new PaginatedResult<ScheduleResponse[]>();

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) 
  {}

  

  create(requestData: Schedule) : Observable<any>
  {
    return this.http.post(SCHEDULE_API + '/add', 
      requestData,     
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => { return err })
    )
  }

  getListSchedules() : Observable<any>
  {
    return this.http.get(
      SCHEDULE_API + '/list',
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  getListSchedulesPagination(page: number, size: number) : Observable<any>
  {
    return this.http.get(`${SCHEDULE_API}/list/?page=${page}&size=${size}`,).pipe(
      map((response: any) => { 
        this.paginatedResult.result = response.data.content;
        this.paginatedResult.pagination = {
          pageNumber: response.data.pageable.pageNumber,
          pageSize: response.data.pageable.pageSize,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        }
        return this.paginatedResult;
      }),
      catchError( err => {
          return err  
        })      
    )
  }

  getScheduleDetail(id: any)
  {
    return this.http.get(
      SCHEDULE_API + '/detail/' + id,
    ).pipe(
      map((response: any) => 
      {


        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  getCalendarPublic(pathMapping: string, fromDate: string, toDate: string)
  {
    return this.http.get(
      PUBLIC_API + '/calendar-info/' + `${pathMapping}` + `?fromDate=${fromDate}&toDate=${toDate}`,
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  getActiveCalendar() 
  {
    return this.http.get(
      SCHEDULE_API + '/calendar-info' + '?fromDate=2022-11-01&toDate=2022-12-01',
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  updateCalendar()
  {
    
  }

  async getActiveCalendarUsingPromise(fromDate: string, toDate: string): Promise<any>
  { 
    try 
    {
      const requestApi = `${SCHEDULE_API}/calendar-info/?fromDate=${fromDate}&toDate=${toDate}`
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } 
    catch (error) 
    {
      return 'error';
    }
  }

  async getPublicCalendarUsingPromise(pathMapping: string, fromDate: string, toDate: string): Promise<any>
  { 
    try 
    {
      const requestApi = `${PUBLIC_API}/calendar-info/${pathMapping}?fromDate=${fromDate}&toDate=${toDate}`
      const response = await lastValueFrom(this.http.get(requestApi));
      return response;
    } 
    catch (error) 
    {
      return 'error';
    }
  }







}
