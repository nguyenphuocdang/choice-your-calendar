import { Component, Input, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../authentication/register/signup-google/auth.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../_services/local-storage.service';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  @Input() isUserLoggedIn: boolean = false;
  @Input() userName: string = '';
  isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(
    this.isUserLoggedIn
  );
  isUserLoggedOut: boolean = false;

  constructor(
    private router: Router,
    @Optional() private dialog: MatDialog,

    private Location: Location,
    private storageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this._verifyUser();
    if (this.Location.path() == '') {
      this.isUserLoggedIn = false;
      this.isUserLoggedIn$.next(this.isUserLoggedIn);
    }
  }
  onContactPopup() {
    this.router.navigateByUrl('/pricing');
  }
  redirectHomepage() {
    this.router.navigate(['/*']);
  }

  onLoginPopup() {
    this.router.navigate(['/login']);
  }

  onAuthPopup() {
    this.dialog.open(AuthComponent);
  }

  onLogout() {}

  onUserLoggedIn(isUserLoggedIn: boolean) {
    this.isUserLoggedIn = isUserLoggedIn;
  }

  private _verifyUser() {
    const token = this.storageService.getAccessToken();
    if (token != null) {
      this.isUserLoggedIn = true;
      this.isUserLoggedIn$.next(this.isUserLoggedIn);
    }
  }
}
