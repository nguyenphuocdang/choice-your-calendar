import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { socketRequest } from '../_models/request';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../_models/response';
import Utils from '../_utils/utils';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  stompClient: any;
  private messageSubject = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

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

  connect(userId: string) {
    // const brokerURL = `https://api.timechoice.solutions:8000/ws?${userId}`;
    // const ws = new SockJS(brokerURL);
    // const stompClient = Stomp.over(ws);
    // stompClient.connect(
    //   {},
    //   () => {
    //     debugger;
    //     this.stompClient.subscribe(
    //       '/user/notify/private-messages',
    //       (message: any) => {
    //         debugger;
    //         const messageData = JSON.parse(message);
    //         console.log(`Received message: ${messageData}`);
    //         // this.messageSubject.next(JSON.parse(message.body));
    //       }
    //     );
    //   },
    //   (error: any) => {
    //     debugger;
    //     console.log('Error connecting: ' + error);
    //   }
    // );

    const brokerURL = `https://api.timechoice.solutions:8000/ws?${userId}`;
    const ws = new SockJS(brokerURL);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      debugger;
      console.log('WebSocket connected');
      this.subscribeToDestination('/user/notify/private-messages');
    });
  }

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
    debugger;
    this.stompClient.subscribe(simpleBroker, (message: any): any => {
      const textDecoder = new TextDecoder();
      const stringObject = textDecoder.decode(message._binaryBody);
      const jsonObject = JSON.parse(stringObject);
      const resultMessage: string = jsonObject.content;
      console.log(resultMessage);
      debugger;
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

  private subscribeToDestination(destination: string): void {
    this.stompClient.subscribe(destination, (message: any) => {
      debugger;
      const messageData = JSON.parse(message.body);
      console.log(`Received message: ${messageData}`);
      // Do something with the received message
    });
  }
}
