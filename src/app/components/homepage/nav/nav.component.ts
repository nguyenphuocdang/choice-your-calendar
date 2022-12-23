import { Component, Input, OnInit, Optional } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthComponent } from '../../authentication/register/auth.component';
import { LoginComponent } from '../../authentication/login/login.component';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { LocalStorageService } from '../../../_services/local-storage.service';
import { Location } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() isUserLoggedIn: boolean = false;
  @Input() userName: string = '';
  isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(this.isUserLoggedIn);
  isUserLoggedOut: boolean = false
  constructor(@Optional() private dialog: MatDialog,
  private router: Router,
  private Location:Location,
  private storageService: LocalStorageService,
  private route: ActivatedRoute,
  private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this._verifyUser();
    if (this.Location.path() == '')
    {
      this.isUserLoggedIn = false;
      this.isUserLoggedIn$.next(this.isUserLoggedIn);
    }
  }

  onLoginPopup()
  {
    const dialogRef = this.dialog.open(LoginComponent)
    dialogRef.afterClosed().subscribe(result => 
      {
        if (result != null)
        {
          if (result.isUserLoggedIn && result.userRole.length > 0)
          {
            this.isUserLoggedIn = result.isUserLoggedIn;
            if (result.userRole === 'ROLE_ADMIN')
            {
              this.router.navigate(['/admin/admin-dashboard']);
            }
            else if (result.userRole === 'ROLE_BASIC_USER')
            {
              this.router.navigateByUrl('homepage/active-calendar');
            }
          }
        }
        else 
        {
          this.toastrService.error('Login Attemp Failed', 'Error');
        }

      })
  }

  onAuthPopup()
  {
    this.dialog.open(AuthComponent);
  }

  onLogout()
  {

  }

  onUserLoggedIn(isUserLoggedIn: boolean)
  {
    this.isUserLoggedIn = isUserLoggedIn;
  }

  private _verifyUser()
  {
    const token = this.storageService.getAccessToken();
    if (token != null)
    {
      this.isUserLoggedIn = true;
      this.isUserLoggedIn$.next(this.isUserLoggedIn);
    }
  }
}
