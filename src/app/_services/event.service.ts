import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { EventCreateRequest, EventDetail, EventSearchRequest, SharedCalendarDetails } from '../_models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  EVENT_API = 'http://localhost:8000/api/event'
  NOTIFY_API = 'http://localhost:8000/api/notify'
  eventList: EventDetail[] = [];

  selectedCalendar: SharedCalendarDetails = {
    id: 0,
    ownerNotifyEmail: '',
    title: '',
    notifyImageLink: '',
    notifyLink: '',
    notifyDate: '',
    seenFlag: false
  };
  $selectedNotification: BehaviorSubject<SharedCalendarDetails> = new BehaviorSubject(this.selectedCalendar);

  constructor(
    private http: HttpClient,

  ) { }

  createNewEvent(requestBody: EventCreateRequest) : Observable<any>
  {
    debugger
    return this.http.post(`${this.EVENT_API}/add`,requestBody)
    .pipe(
      map((response: any) => 
      {
        debugger
        if (response.statusCode === 200)
        {
          return response;
        }
        return response;
      }),
      catchError( err => 
        {
          debugger
          return "error"; 
        })
    )
  }

  searchListEvents(startTime: string, endTime: string, page: number, size: number) : Observable<any>
  {
    const requestBody: EventSearchRequest = 
    {
      endTime: endTime,
      eventDescription: '',
      eventName: '',
      hostName: '',
      partnerName: '',
      startTime: startTime,
    }
    return this.http.post(`${this.EVENT_API}/list?page=${page}&size=${size}`, requestBody)
                    .pipe(map((response: any) => 
                      {
                        if (response.statusCode == 200 && response.data.content.length > 0)
                        {
                          response.data.content.forEach((element: any)=> {
                            let startTime = new Date(element.startTime);
                            let endTime = new Date(element.endTime);
                            element.startTime = startTime.toDateString();
                            element.endTime = startTime.toLocaleTimeString() + ' - ' + endTime.toLocaleTimeString();
                          });
                          this.eventList = response.data.content;
                        }
                        return this.eventList;
                      }),
                      catchError(
                        err => 
                        {
                          return this.eventList;
                        })  
)
  }

  getListOfSharedCalendars(size: number) : Observable<any>
  {
    let sharedCalendarList : SharedCalendarDetails[] = [];
    return this.http.get(`${this.NOTIFY_API}/list?size=${size}`).pipe(
      map((response: any)=>
      {
        if (response.statusCode === 200 && response.data.content.length > 0) 
        {
          response.data.content.forEach((element: any)=> {
            let date = new Date(element.notifyDate);
            element.notifyDate = date.toDateString() + ' at ' + date.toLocaleTimeString();
          });
          sharedCalendarList = response.data.content;
        }
        return sharedCalendarList;
      }),
      catchError( err => 
        {
          debugger
          return err 
        })
    )
  }

  updateNotification(data: SharedCalendarDetails)
  {
    this.$selectedNotification.next(data);
  }
}
