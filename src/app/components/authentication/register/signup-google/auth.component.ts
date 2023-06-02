import { Component, OnInit, Optional } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AccountRegister, AccountVerify } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import Utils from 'src/app/_utils/utils';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  hide: boolean = false;
  verificationCode: string = '';
  registerAccountId: number = 0;
  planType: string = '';
  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    @Optional() public dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AuthComponent>,
    private router: Router
  ) {
    try {
      this.planType =
        this.router.getCurrentNavigation()!.extras.state!['planType'];
    } catch (error) {
      console.log('Plan Type error: ', error);
    }
  }

  ngOnInit(): void {}

  // registerForm: FormGroup = this.fb.group(
  //   {
  //     fullName: ['',[Validators.required]],
  //     userName: ['',[Validators.required]],
  //     address: ['', [Validators.required]],
  //     gender: [false],
  //     email: ['',[Validators.required, Validators.email]],
  //     password: ['',[Validators.required, Validators.minLength(8)]],
  //     verificationCode: [],
  //   }
  // )

  registerForm: UntypedFormGroup = this.fb.group({
    fullName: [''],
    userName: [''],
    address: [''],
    gender: [false],
    email: [''],
    password: [''],
    verificationCode: [],
  });

  get fullName() {
    return this.registerForm.get('fullName');
  }
  get userName() {
    return this.registerForm.get('userName');
  }
  get address() {
    return this.registerForm.get('address');
  }
  get gender() {
    return this.registerForm.get('gender');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  onSignupGoogle() {
    const signUpGoogleUrl: string = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&state=${this.planType}&redirect_uri=https://timechoice.solutions/authorize/oauth2/user/callback&client_id=460639175107-rb3km6k5eac1aq9oihqcq1htkhvbqfif.apps.googleusercontent.com`;
    window.location.href = signUpGoogleUrl;
  }

  onRegister(form: UntypedFormGroup) {
    if (this.registerForm.valid) {
      let requestBody: AccountRegister = {
        address: this.registerForm.value.address,
        description: '',
        fullname: this.registerForm.value.fullName,
        password: this.registerForm.value.password,
        username: this.registerForm.value.userName,
        gender: false,
        accountType: '',
        authorizationCode: '',
        error: '',
        redirecetUri: '',
      };
      requestBody.gender =
        this.registerForm.value.gender == 'male' ? true : false;
      this._register(requestBody);
    }
  }

  _register(requestBody: AccountRegister) {
    this.userService.register(requestBody).subscribe((response: any) => {
      debugger;
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        this.registerAccountId = response.data.id;
        this.toastrService.success(
          'Your account is being verified, please check your mail to get the result',
          '200 SUCCESS'
        );
      } else if (response.statusCode === 400) {
        this.toastrService.error(response.data[0].errorMessage, '400 ERROR');
      }
    });
  }

  exit() {
    this.dialogRef.close();
  }

  onConfirm() {
    let resquestBody: AccountVerify = {
      registerAccountId: this.registerAccountId,
      verifyCode: this.registerForm.value.verificationCode,
    };

    this.userService.verifyAccount(resquestBody).subscribe((response: any) => {
      debugger;
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        this.toastrService.success(
          'Check your email account to get the result',
          'SUCCESS 200'
        );
      } else {
        this.toastrService.error(
          'There is a problem with the server',
          'ERROR 400'
        );
      }
    });
  }

  onRedirectLogin() {
    console.log('Redirect to Login');
  }
}
