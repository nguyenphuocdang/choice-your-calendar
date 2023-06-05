import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificationData, NotificationContent } from 'src/app/_models/notify';
import { ApiResponse } from 'src/app/_models/response';
import { UserProfile } from 'src/app/_models/user';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { SocketService } from 'src/app/_services/socket.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
})
export class WrapperComponent implements OnInit {
  isExpanded: boolean = true;
  isSelected: boolean = false;
  isShowingNotificationSidenav: boolean = false;
  role: string = '';
  user: UserProfile = {
    id: 0,
    fullname: '',
    email: '',
    address: '',
    description: '',
    active: true,
    imagePath: '',
    effectiveDate: '',
    expiredDate: '',
    pathMapping: '',
    autoApprovalEventFlag: true,
  };
  isShowing = false;
  showSubmenu: boolean = false;
  notificationList: NotificationContent[] = [];
  badgeContent: number | '' = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastrService: ToastrService,
    private storageService: LocalStorageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.role = this.activatedRoute.snapshot.data['role'];
    this.activatedRoute.params.subscribe(() => {
      this._getUserProfile();
    });
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  _getUserProfile() {
    try {
      this.userService.getUserProfile().subscribe(async (response: any) => {
        if (
          response.statusCode === 200 &&
          response.statusMessage === 'Successfully'
        ) {
          this.user = response.data;
          this.storageService.setUserProfile(this.user);
          this._handleWebsocket(response.data.id);
          const roleResponse: any = await this.userService.getRolePromise();
          this.role = roleResponse.data[0].code;
        } else {
          this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
        }
      });
    } catch (error) {
      this.toastrService.error('Error getting user profile', 'ERROR');
    }
  }
  redirectHomepage() {
    this.router.navigate(['/*']);
  }

  changeColor() {
    this.isSelected = !this.isSelected;
  }

  profileMouseEnter() {}
  _handleWebsocket(userId: number) {
    this.socketService.subscribe(
      '/user/notify/private-messages',
      (message: any) => {
        debugger;
        if (this.badgeContent === '') this.badgeContent = 1;
        else this.badgeContent++;
        const messageData = JSON.parse(message.body);
        console.log(messageData);
      },
      userId
    );
  }

  toggleAppMenuSidenav() {
    this.isExpanded = !this.isExpanded;
  }

  toggleNotificationSidenav() {
    this.isShowingNotificationSidenav = !this.isShowingNotificationSidenav;
    this._getNotificationData();
  }

  _getNotificationData() {
    try {
      this.userService
        .getNotifyData()
        .subscribe((response: ApiResponse<NotificationData>) => {
          if (response.statusCode === 200) {
            let notificationDataList: NotificationContent[] = [];
            response.data.content.forEach(
              (notification: any, index: number) => {
                const newNotification: NotificationContent =
                  new NotificationContent(notification);
                notificationDataList.push(newNotification);
              }
            );
            this.notificationList = notificationDataList;
          } else {
            debugger;
          }
        });
    } catch (error: any) {
      debugger;
    }
  }

  onNotificationClick(notification: NotificationContent) {
    window.location.href =
      'http://localhost:4200/homepage/public-sharing-slots/reschedule-event?eventId=183&fromDate=2023-06-24 15:00&toDate=2023-06-24 17:00';
  }

  removeBadge() {
    this.badgeContent = ''; // Empty the badge content to remove it
  }
}
