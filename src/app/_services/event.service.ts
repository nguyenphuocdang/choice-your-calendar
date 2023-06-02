import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  BookingSlotRequest,
  BookPublicRequest,
  CreateExternalSlotRequest,
  EventCreateRequest,
  EventDetail,
  EventSearchRequest,
  JoinEventRequest,
  MakeEventRequest,
  MakePublicShareRequest,
  ReschedulePublicRequest,
  SharedCalendarDetails,
  SingleEventDetail,
} from '../_models/event';
import Utils from '../_utils/utils';
import {
  ApiResponse,
  CustomError,
  DataListResponse,
} from '../_models/response';
import {
  PublicScheduleData,
  ScheduleData,
  ScheduleDatas,
} from '../_models/schedule';
import { DeviceOfEvent } from '../_models/resource';
import { UserOfEvent } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventList: EventDetail[] = [];

  selectedCalendar: SharedCalendarDetails = {
    id: 0,
    ownerNotifyEmail: '',
    title: '',
    notifyImageLink: '',
    notifyLink: '',
    notifyDate: '',
    seenFlag: false,
  };
  $selectedNotification: BehaviorSubject<SharedCalendarDetails> =
    new BehaviorSubject(this.selectedCalendar);

  constructor(private http: HttpClient) {}

  createNewEvent(requestBody: EventCreateRequest): Observable<any> {
    debugger;
    return this.http
      .post(`${Utils.ORGANIZATION_API}/event/add`, requestBody)
      .pipe(
        map((response: any) => {
          debugger;
          if (response.statusCode === 200) {
            return response;
          }
          return response;
        }),
        catchError((err) => {
          debugger;
          return 'error';
        })
      );
  }

  getEventList(
    requestBody: EventSearchRequest,
    page: number,
    size: number,
    sortCondition: string
  ): Observable<ApiResponse<DataListResponse<EventDetail[]>>> {
    const requestUrl = `${Utils.EVENT_API}/list?page=${page}&size=${size}&sort=${sortCondition}`;
    return this.http
      .post<ApiResponse<DataListResponse<EventDetail[]>>>(
        requestUrl,
        requestBody
      )
      .pipe(
        map((response: ApiResponse<DataListResponse<EventDetail[]>>) => {
          return response;
        }),
        catchError((error: any) => {
          // handle error
          return throwError(new CustomError(error));
        })
      );
  }
  searchListEvents(
    startTime: string,
    endTime: string,
    page: number,
    size: number
  ): Observable<any> {
    const requestBody: EventSearchRequest = {
      endTime: endTime,
      eventDescription: '',
      eventName: '',
      hostName: '',
      partnerName: '',
      startTime: startTime,
    };
    return this.http
      .post(`${Utils.EVENT_API}/list?page=${page}&size=${size}`, requestBody)
      .pipe(
        map((response: any) => {
          if (response.statusCode == 200 && response.data.content.length > 0) {
            response.data.content.forEach((element: any) => {
              let startTime = new Date(element.startTime);
              let endTime = new Date(element.endTime);
              element.startTime = startTime.toDateString();
              element.endTime =
                startTime.toLocaleTimeString() +
                ' - ' +
                endTime.toLocaleTimeString();
            });
            this.eventList = response.data.content;
          }
          return this.eventList;
        }),
        catchError((err) => {
          return this.eventList;
        })
      );
  }

  getListOfSharedCalendars(size: number): Observable<any> {
    let sharedCalendarList: SharedCalendarDetails[] = [];
    return this.http.get(`${Utils.NOTIFY_API}/list?size=${size}`).pipe(
      map((response: any) => {
        if (response.statusCode === 200 && response.data.content.length > 0) {
          response.data.content.forEach((element: any) => {
            let date = new Date(element.notifyDate);
            element.notifyDate =
              date.toDateString() + ' at ' + date.toLocaleTimeString();
          });
          sharedCalendarList = response.data.content;
        }
        return sharedCalendarList;
      }),
      catchError((err) => {
        debugger;
        return err;
      })
    );
  }

  updateNotification(data: SharedCalendarDetails) {
    this.$selectedNotification.next(data);
  }

  shareCalendar(data: any) {
    return this.http.post(`${Utils.SCHEDULE_API}/share-calendar`, data).pipe(
      map((response: any) => {
        debugger;
        if (response.statusCode === 200) {
          // response.data.content.forEach((element: any)=> {
          //   let date = new Date(element.notifyDate);
          //   element.notifyDate = date.toDateString() + ' at ' + date.toLocaleTimeString();
          // });
          // sharedCalendarList = response.data.content;
          return response.data;
        } else {
          return 'error';
        }
        // return sharedCalendarList;
      }),
      catchError((err) => {
        debugger;
        return 'error';
      })
    );
  }

  getBookingSlots(
    requestBody: BookingSlotRequest
  ): Observable<ApiResponse<ScheduleDatas>> {
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/merge-calendar`;
    return this.http
      .post<ApiResponse<ScheduleDatas>>(requestUrl, requestBody)
      .pipe(
        map((response: ApiResponse<ScheduleDatas>) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  makeNewEvent(requestBody: MakeEventRequest): Observable<any> {
    return this.http
      .post(`${Utils.ORGANIZATION_API}/event/add`, requestBody)
      .pipe(
        map((response: any) => {
          if (response.statusCode === 200) {
            return response;
          }
          return new CustomError(response.errors);
        }),
        catchError((err: any) => {
          debugger;
          return throwError(err);
        })
      );
  }
  getEventDetail(eventId: number): Observable<any> {
    return this.http
      .get<ApiResponse<SingleEventDetail>>(
        `${Utils.EVENT_API}/detail/${eventId}`
      )
      .pipe(
        map((response: ApiResponse<SingleEventDetail>) => {
          if (response.statusCode === 200) return response;
          else return new CustomError(response.errors);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  getAllDeviceInYourEvent(eventId: number): Observable<any> {
    return this.http
      .get<ApiResponse<DeviceOfEvent[]>>(
        `${Utils.ORGANIZATION_API}/device/get-all-device-of-event/${eventId}`
      )
      .pipe(
        map((response: ApiResponse<DeviceOfEvent[]>) => {
          if (response.statusCode === 200) return response;
          else return new CustomError(response.errors);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  getAllUserInYourEvent(eventId: number): Observable<any> {
    return this.http
      .get<ApiResponse<UserOfEvent[]>>(
        `${Utils.ORGANIZATION_API}/user/get-all-user-of-event/${eventId}`
      )
      .pipe(
        map((response: ApiResponse<UserOfEvent[]>) => {
          if (response.statusCode === 200) return response;
          else return new CustomError(response.errors);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
  getAllOrganizationEvents(
    startTime: string,
    endTime: string,
    hostEmail: string
  ): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/event/get-all-public-event-of-your-organization`;
    const requestBody: any = {
      startTime: startTime,
      endTime: endTime,
      hostEmail: hostEmail,
    };
    return this.http
      .post<ApiResponse<SingleEventDetail[]>>(requestUrl, requestBody)
      .pipe(
        map((response: ApiResponse<SingleEventDetail[]>) => {
          if (response.statusCode === 200) return response;
          else return new CustomError(response.errors);
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
  joinOrganizationEvent(
    eventId: number,
    listEmailJoining: string[]
  ): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/event/join`;
    const requestBody: any = {
      eventId: eventId,
      listEmailJoining: listEmailJoining,
    };
    return this.http.put<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPublicShareInfo(pathMapping: string, shareCode: string): Observable<any> {
    const requestUrl = `${Utils.PUBLIC_API}/get-public-share-info/${pathMapping}?shareCode=${shareCode}`;
    debugger;
    return this.http.get<ApiResponse<any>>(requestUrl).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPublicScheduleCalendarInfo(
    pathMapping: string,
    shareCode: string
  ): Observable<any> {
    const requestUrl = `${Utils.PUBLIC_API}/calendar-info/${pathMapping}?shareCode=${shareCode}`;
    return this.http.get<ApiResponse<any>>(requestUrl).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  getPublicSlotsForReschedule(
    pathMapping: string,
    shareCode: string
  ): Observable<any> {
    const requestUrl = `${Utils.PUBLIC_EVENT_API}/get-slot-for-reschedule/${pathMapping}?shareCode=${shareCode}`;
    return this.http.get<ApiResponse<any>>(requestUrl).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  confirmBookingPublicSlot(requestBody: BookPublicRequest): Observable<any> {
    const requestUrl = `${Utils.PUBLIC_EVENT_API}/add`;
    debugger;
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        debugger;
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  rescheduleBookingSlot(requestBody: ReschedulePublicRequest): Observable<any> {
    debugger;
    const requestUrl = `${Utils.PUBLIC_EVENT_API}/edit`;
    debugger;
    return this.http.put<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        debugger;
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  createExternalSlots(requestBody: CreateExternalSlotRequest): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/event/create-external-slot`;
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  getAllExternalSlots(startTime: string, endTime: string): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/event/get-all-external-slot`;
    const requestBody: any = {
      startTime: startTime,
      endTime: endTime,
    };
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  createPublicShare(requestBody: MakePublicShareRequest): Observable<any> {
    debugger;
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/public-share/add`;
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        debugger;
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  sharePublicSlots(
    listEmails: string[],
    publicShareId: number
  ): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/schedule/public-share/share-calendar`;
    const requestBody = {
      listPartnerEmail: listEmails,
      publicShareId: publicShareId,
    };
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  getSlotsForReschedule(startTime: string, endTime: string, eventId: number) {
    const requestBody: any = {
      startTime: startTime,
      endTime: endTime,
      eventId: eventId,
    };
    const requestUrl = `${Utils.ORGANIZATION_API}/event/get-slot-for-reschedule`;
    return this.http
      .post<ApiResponse<ScheduleDatas>>(requestUrl, requestBody)
      .pipe(
        map((response: ApiResponse<ScheduleDatas>) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  rescheduleOrganizationEvent(requestBody: any): Observable<any> {
    const requestUrl = `${Utils.ORGANIZATION_API}/event/edit`;
    return this.http.put<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        debugger;
        return throwError(error);
      })
    );
  }

  getPublicEventDetailByPublicPartner(
    pathMapping: string,
    shareCode: string
  ): Observable<any> {
    const requestUrl = `${Utils.PUBLIC_EVENT_API}/detail/${pathMapping}?shareCode=${shareCode}`;
    return this.http.get<ApiResponse<any>>(requestUrl).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  sharePublicEventToPartner(
    eventId: number,
    listPartnerEmail: string[]
  ): Observable<any> {
    const requestUrl: string = `${Utils.ORGANIZATION_API}/event/share-public-event`;
    const requestBody: any = {
      eventId: eventId,
      listPartnerEmail: listPartnerEmail,
    };
    return this.http.post<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  joinPublicEventByPublicPartner(requestBody: any): Observable<any> {
    debugger;
    const requestUrl = `${Utils.PUBLIC_EVENT_API}/join`;
    return this.http.put<ApiResponse<any>>(requestUrl, requestBody).pipe(
      map((response: ApiResponse<any>) => {
        if (response.statusCode === 200) return response;
        else return new CustomError(response.errors);
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }
}
