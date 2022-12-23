import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Optional, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
// import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
// import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
// import { RedirectHandler } from '@azure/msal-browser/dist/internals';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { AuthService } from '../../../_services/auth.service';
import { UserService } from '../../../_services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocalStorageService } from '../../../_services/local-storage.service';
import { AuthComponent } from '../register/auth.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() onLoginComplete = new EventEmitter<boolean>();
  hide: boolean = true;
  isUserLoggedIn: boolean = false;
  userRole: string ='';
  data: any;
  loginRequestModel: any = {};
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    // @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig : MsalGuardConfiguration,
    // private msalBroadCastService : MsalBroadcastService,
    // private msService : MsalService,
    private http: HttpClient,
    private router: Router,
    //injecting Services into Component
    private userService: UserService,
    private storageService: LocalStorageService,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>,
    @Optional() public dialog: MatDialog,
    private toastrService: ToastrService,
    ) { }
    
    get username() { return this.loginForm.get('username'); }
    get password() { return this.loginForm.get('password'); }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]),
    })



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

  redirect(url: string)
  {
    this.router.navigate([url])
  }

  onLoginSubmit(form: FormGroup)
  {    
    this.loginRequestModel = form.value
    this.userService.login(this.loginRequestModel).subscribe(
      (response: any) => 
      {
        if(response.statusCode === 200 && response.data != null)
        {
          this.isUserLoggedIn = true;
          this.onLoginComplete.emit(this.isUserLoggedIn);
          this.userService.getRole().subscribe(
            (response: any) => 
            {
              this.userRole = response.data[0].code;
              this.storageService.setRole(this.userRole);
              this.dialogRef.close({'isUserLoggedIn': this.isUserLoggedIn, 'userRole': this.userRole}); 
            },
          )        
        }
        else 
        {
          this.toastrService.error('Login Attemp Failed', 'Error');
        }

      }, 
      error =>
      {
        console.log(error)
      }
    )

  if(this.isUserLoggedIn)
  {
    
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
  switchToRegister()
  {
    this.dialogRef.close(LoginComponent);
    this.dialog.open(AuthComponent);
  }
  onLogout()
  {
    this.isUserLoggedIn = false;
    // this.msService.logoutRedirect()
  }
}
