import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserProfile } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import Utils from 'src/app/_utils/utils';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
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
  role: string = '';
  constructor(
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this._getUserProfile();
  }

  _getUserProfile() {
    try {
      this.userService.getUserProfile().subscribe(async (response: any) => {
        if (
          response.statusCode === 200 &&
          response.statusMessage === 'Successfully'
        ) {
          this.user = response.data;
          this.user.effectiveDate = Utils.convertUTCtoDateString(
            response.data.effectiveDate,
            true
          );
          this.user.expiredDate = Utils.convertUTCtoDateString(
            response.data.expiredDate,
            true
          );
          const roleResponse: any = await this.userService.getRolePromise();
          if (
            roleResponse.statusCode === 200 &&
            roleResponse.data[0].code === 'ROLE_BUSINESS_USER'
          )
            this.role = 'Business Account';
          else {
            this.role = 'Basic Account';
          }
        } else {
          debugger;
          this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
        }
      });
    } catch (error) {
      debugger;
      this.toastrService.error('Error getting user profile', 'ERROR');
    }
  }
}
