import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { socketRequest } from '../_models/request';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../_models/response';
import Utils from '../_utils/utils';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import {
  NotifyUserJoinEvent,
  RequestDeviceToApprover,
  ResponseBorrowDeviceToClient,
  SocketMessage,
} from '../_models/socket';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  stompClient: any;
  private messageSubject = new BehaviorSubject<any>(null);
  socketToastrConfig: Partial<IndividualConfig> = {
    timeOut: 5000,
    extendedTimeOut: 5000,
  };

  constructor(private http: HttpClient, private toastrService: ToastrService) {}
  subscribe(simpleBroker: string, callback: any, roomId: number): void {
    const brokerURL = `https://api.timechoice.solutions:8000/ws?${roomId}`;
    const ws = new SockJS(brokerURL);
    this.stompClient = Stomp.over(ws);
    const connected: boolean = this.stompClient.connected;

    if (connected) {
      this.subscribeNotification(simpleBroker, callback);
      return;
    }
    this.stompClient.connect({}, () => {
      this.subscribeNotification(simpleBroker, callback);
    });
  }

  private subscribeNotification(simpleBroker: string, callback: any): void {
    this.stompClient.subscribe(simpleBroker, (message: any): any => {
      const textDecoder = new TextDecoder();
      const stringObject = textDecoder.decode(message._binaryBody);
      const jsonObject: SocketMessage<any> = JSON.parse(stringObject);
      const resultMessage: any = jsonObject.content;
      debugger;
      if (this.isNotifyUserJoinEvent(jsonObject.content)) {
        const message: string = `User ${jsonObject.content.allNewPartnerEmail} joins your event.`;
        this.toastrService.info(
          message,
          `Event ${jsonObject.content.eventName} New Participant`,
          this.socketToastrConfig
        );
      } else if (this.isNotifyUserBorrowDevice(jsonObject.content)) {
        const message: string = `New Request Booking For ${jsonObject.content.deviceName}`;
        this.toastrService.info(
          message,
          `Event ${jsonObject.content.eventName} Resources Booking Request`,
          this.socketToastrConfig
        );
      } else if (this.isNotifyUserCompleteBorrow(jsonObject.content)) {
        const message: string = `All Resources For Event ${jsonObject.content.eventName} are approved.`;
        this.toastrService.info(
          message,
          `Resources Booking Approval`,
          this.socketToastrConfig
        );
      }
      callback();
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }

  isNotifyUserJoinEvent(obj: any): obj is NotifyUserJoinEvent {
    const requiredKeys: (keyof NotifyUserJoinEvent)[] = [
      'allNewPartnerEmail',
      'eventName',
    ];
    const mapResult: any = requiredKeys.every((key) => key in obj);
    debugger;
    return requiredKeys.every((key) => key in obj);
  }

  isNotifyUserBorrowDevice(obj: any): obj is RequestDeviceToApprover {
    const requiredKeys: (keyof RequestDeviceToApprover)[] = [
      'borrowId',
      'eventName',
      'deviceCode',
      'deviceName',
      'startTime',
      'endTime',
      'requesterFullName',
      'requesterEmail',
    ];
    debugger;
    return requiredKeys.every((key) => key in obj);
  }

  isNotifyUserCompleteBorrow(obj: any): obj is ResponseBorrowDeviceToClient {
    const requiredKeys: (keyof ResponseBorrowDeviceToClient)[] = [
      'eventName',
      'rejectedDeviceName',
      'rejectedDeviceCode',
      'deviceType',
    ];
    debugger;
    return requiredKeys.every((key) => key in obj);
  }
}
