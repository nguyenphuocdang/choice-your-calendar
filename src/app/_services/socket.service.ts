import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { socketRequest } from '../_models/request';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../_models/response';
import Utils from '../_utils/utils';
// import {
//   Stomp,
//   StompConfig,
//   StompHeaders,
//   Client,
//   Message,
// } from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';
import { Socket } from 'socket.io-client';
import * as SockJS from 'sockjs-client';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  API_URL: string = 'https://api.timechoice.solutions:8000/ws';
  socket = new SockJS(`${this.API_URL}`);
  stompClient = Stomp.over(this.socket);
  private messageSubject = new BehaviorSubject<any>(null);
  headers: any;
  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) {
    const accessToken = this.storageService.getAccessToken();
    this.headers = {
      Authorization: 'Bearer ' + accessToken,
      // add any other headers if needed
    };
  }

  sendPrivateMessage(requestBody: socketRequest): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(
        `${Utils.SOCKET_API}/send-private-message`,
        requestBody
      )
      .pipe(
        map((response: ApiResponse<any>) => {
          return response;
        }),
        catchError((error: any) => {
          // handle error
          debugger;
          return throwError(error);
        })
      );
  }

  connect() {
    const brokerURL = 'https://api.timechoice.solutions:8000/ws';
    const ws = new SockJS(brokerURL);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect(
      this.headers,
      () => {
        this.stompClient.subscribe(
          '/notify/private-messages',
          (message: any) => {
            debugger;
            console.log('Received message: ' + JSON.parse(message));
            this.messageSubject.next(JSON.parse(message.body));
          }
        );
      },
      (error: any) => {
        debugger;
        console.log('Error connecting: ' + error);
      }
    );
  }

  subscribe(simpleBroker: string, callback: any, roomId: number): void {
    const connected: boolean = this.stompClient.connected;
    if (connected) {
      this.subscribeNotification(simpleBroker, callback);
      return;
    }

    const headers: any = {
      roomId: roomId,
    };

    this.stompClient.connectHeaders = {
      roomId: roomId.toString(),
    };

    this.stompClient.connect({ roomId: roomId }, () => {
      this.subscribeNotification(simpleBroker, callback);
    });
    debugger;
  }

  private subscribeNotification(simpleBroker: string, callback: any): void {
    this.stompClient.subscribe(simpleBroker, (): any => {
      callback();
    });
  }

  // disconnect() {
  //   if (this.stompClient != null) {
  //     this.stompClient.disconnect();
  //   }
  // }

  testWebsocket() {
    const data: socketRequest = {
      content: 'Testing Message Of Websocket Client',
      messageFrom: '',
      messageFromEmail: '',
      messageTo: '',
      messageType: '',
    };
    this.stompClient.send(
      '/app/send-message-to-socket/send-private-message',
      {},
      JSON.stringify(data)
    );
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }
}
