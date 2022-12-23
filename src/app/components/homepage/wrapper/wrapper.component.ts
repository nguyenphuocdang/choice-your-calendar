import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/_models/user';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  isExpanded: boolean = true;
  role: string = '';
  user: UserProfile = {
    id: 6,
    fullname: '',
    email: '',
    address: '',
    description: '',
    active: true,
    imagePath: '',
    effectiveDate: '',
    expiredDate: '',
    pathMapping: '',
    autoApprovalEventFlag: true
  };
  isShowing = false;
  showSubmenu: boolean = false;

  constructor(
    private http: HttpClient,
    private router: ActivatedRoute,
    private userService: UserService,
    private storageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.role = this.router.snapshot.data['role'];
    this.router.params.subscribe
    (
      () => {
        this._getUserProfile();
      }
    )
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
  _getUserProfile()
  {
    this.userService.getUserProfile().subscribe(
      (response: UserProfile) =>
      {
        if (response.email != null || response.email != '')
        {         
          this.user = response;
          this.storageService.setEmail(this.user.email);
        }
      }
    )
  }


}
