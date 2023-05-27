import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private http: HttpClient,
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
        const messageData = JSON.parse(message.body);
        console.log(messageData);
      },
      userId
    );
  }
}
