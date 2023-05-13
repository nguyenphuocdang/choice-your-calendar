import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { socketRequest } from 'src/app/_models/request';
import { SocketService } from 'src/app/_services/socket.service';

@Component({
  selector: 'app-approve-dashboard',
  templateUrl: './approve-dashboard.component.html',
  styleUrls: ['./approve-dashboard.component.scss'],
})
export class ApproveDashboardComponent implements OnInit {
  userId: number = 0;
  message = '';
  messages: any[] = [];
  constructor(
    private socketService: SocketService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // this.sendMessageToServer();
    // this.socketService.connect();
    // this.socketService.getMessage().subscribe((messageResponse) => {
    //   this.messages.push(messageResponse);
    //   console.log('Message received:' + this.messages);
    // });
    this.userId = 10;
    this.socketService.subscribe(
      '/user/notify/private-messages',
      (message: any): any => {
        const messageData = JSON.parse(message.body);
        console.log(messageData);
        debugger;
      },
      this.userId
    );
  }

  sendMessageToServer() {
    const requestBody: socketRequest = {
      content: 'Sending message to server',
      messageFrom: '7',
      messageFromEmail: '',
      messageTo: '',
      messageType: 'NOTIFY',
    };
    try {
      this.socketService
        .sendPrivateMessage(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            console.log('Send message to server successfully');
          } else {
            debugger;
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
