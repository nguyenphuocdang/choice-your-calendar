import { Component } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  API_URL: string = 'https://api.timechoice.solutions:8000/ws';
  socket = new SockJS(`${this.API_URL}`);
  stompClient = Stomp.over(this.socket);
  ngOnInit(): void {
    const userId: number = 10;
    this.subscribe(
      '/user/notify/private-messages',
      (message: any): any => {
        const messageData = JSON.parse(message.body);
        console.log(messageData);
        debugger;
      },
      userId
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
}
