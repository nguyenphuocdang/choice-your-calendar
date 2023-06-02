import {
  Component,
  EventEmitter,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
  NgForm,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '../../../_services/local-storage.service';
import { AuthComponent } from '../register/signup-google/auth.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() onLoginComplete = new EventEmitter<boolean>();
  hide: boolean = true;
  isUserLoggedIn: boolean = false;
  userRole: string = '';
  data: any;
  loginRequestModel: any = {};
  loginForm!: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private storageService: LocalStorageService,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>,
    @Optional() public dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
      ]),
    });

    // this.msalBroadCastService.inProgress$.pipe
    // (
    //   filter(
    //     (interactionStatus : InteractionStatus) =>
    //     interactionStatus == InteractionStatus.None,
    //   )
    // ).subscribe(
    //   x =>
    //   {
    //     this.isUserLoggedIn = this.msService.instance.getAllAccounts.length > 0
    //   }
    // );
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }

  onLoginSubmit(form: UntypedFormGroup) {
    this.loginRequestModel = form.value;
    try {
      this.userService
        .login(this.loginRequestModel)
        .subscribe(async (response: any) => {
          if (response.statusCode === 200 && response.data != null) {
            const roleResponse: any = await this.userService.getRolePromise();
            if (roleResponse.data[0].code === 'ROLE_ADMIN') {
              this.storageService.setRole('ROLE_ADMIN');
              this.toastrService.success(
                `Welcome back ${this.loginForm.get('username')?.value}`,
                'LOGIN SUCCESS'
              );
              this.router.navigate(['/admin/admin-dashboard']);
            } else {
              this.storageService.setRole('ROLE_BASIC_USER');
              this.toastrService.success(
                `Welcome back ${this.loginForm.get('username')?.value}`,
                'LOGIN SUCCESS'
              );
              this.router.navigate(['/homepage/user-profile'], {
                state: { username: this.loginForm.get('username')?.value },
              });
            }
          } else {
            this.toastrService.error(
              response.errors[0].errorMessage,
              'LOGIN ERROR'
            );
          }
        });
    } catch (error) {
      debugger;
    }

    // console.log(form.value);
    // form.reset;

    // this.redirect('calendar-dashboard')
    // this.authService.login(this.loginRequestModel).subscribe(response =>
    //   {
    //     console.log(response)
    //     //handle response
    //     this.isLoggedIn = true;
    //   },
    // error =>
    // {
    //   console.log(error)
    // }
    // )
    //this.router.navigateByUrl('/calendar-dashboard')
    // if (this.msalGuardConfig.authRequest)
    // {
    //   this.authService.loginRedirect(
    //     {...this.msalGuardConfig.authRequest}  as RedirectRequest
    //   );
    // }
    // else
    // {
    //   this.msalGuardConfig.authRequest
    // }
    // this.http.post('https://choose-calendar-app.herokuapp.com/api/auth/basic-login',
    // {"password": "123",
    // "username": "admin"}).subscribe(response =>
    //   {
    //     this.data = response;
    //     console.log(this.data)
    //   }
    // );
  }
  switchToRegister() {
    this.dialogRef.close(LoginComponent);
    this.dialog.open(AuthComponent);
  }
  onLogout() {
    this.isUserLoggedIn = false;
    // this.msService.logoutRedirect()
  }
}
