import { Component, OnInit, Optional } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  userNameValidator,
  fullNameValidator,
  addressValidator,
  passwordValidator,
} from 'src/app/custom-validator/validator';
import { AccountRegister } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomPopupComponent } from 'src/app/components/popup/custom-popup/custom-popup.component';
import { PopupService } from 'src/app/_services/popup.service';

@Component({
  selector: 'app-provide-information',
  templateUrl: './provide-information.component.html',
  styleUrls: ['./provide-information.component.scss'],
})
export class ProvideInformationComponent implements OnInit {
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  passwordNotMatch: UntypedFormControl | undefined;
  authCode: string = '';
  accountType: string = '';
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    @Optional() private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private popupService: PopupService,
    private paymentService: PaymentService,
    private toastrService: ToastrService
  ) {
    if (this.router.getCurrentNavigation()?.extras!.state! != null) {
      this.authCode =
        this.router.getCurrentNavigation()?.extras!.state![
          'authorizationCode'
        ]! ?? '';
    }
    if (this.router.getCurrentNavigation()?.extras!.state! != null) {
      this.accountType =
        this.router.getCurrentNavigation()?.extras!.state!['accountType']! ??
        '';
    }
  }
  registerForm: UntypedFormGroup = this.fb.group({
    fullName: ['', [fullNameValidator]],
    userName: ['', [userNameValidator]],
    address: ['', [addressValidator]],
    gender: [false],
    password: ['', [passwordValidator]],
    confirmPassword: ['', [Validators.required]],
    verificationCode: [],
  });
  ngOnInit(): void {
    this.registerForm!.get('password')!.valueChanges.subscribe(() => {
      this.comparePasswordMatch();
    });
    this.registerForm!.get('confirmPassword')!.valueChanges.subscribe(() => {
      this.comparePasswordMatch();
    });
  }

  get userName() {
    return this.registerForm!.get('userName');
  }

  get fullName() {
    return this.registerForm!.get('fullName');
  }

  get address() {
    return this.registerForm!.get('address');
  }

  get password() {
    return this.registerForm!.get('password');
  }

  get confirmPasword() {
    return this.registerForm!.get('confirmPassword');
  }

  comparePasswordMatch() {
    const password = this.registerForm!.get('password')?.value;
    const confirmPassword = this.registerForm!.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.registerForm!.get('confirmPassword')!.setErrors({
        passwordNotMatch: true,
      });
    }
  }

  onConfirm(form: UntypedFormGroup) {
    // let title: string =
    //   'Your account is almost done. Adding your credit card to complete registration.';
    // let data: any = {
    //   // username: requestBody.username.toString(),
    //   username: 'anakin9472',
    // };
    // this.popupService.openCustomDialog(
    //   CustomPopupComponent,
    //   '200px',
    //   '700px',
    //   title,
    //   'isProceedPayment',
    //   data
    // );

    if (form.valid) {
      let requestBody: AccountRegister = {
        address: this.registerForm.value.address,
        description: '',
        fullname: this.registerForm.value.fullName,
        password: this.registerForm.value.password,
        username: this.registerForm.value.userName,
        gender: false,
        accountType: this.accountType,
        authorizationCode: this.authCode,
        error: '',
        redirecetUri:
          'https://timechoice.solutions/authorize/oauth2/user/callback',
      };
      requestBody.gender =
        this.registerForm.value.gender == 'male' ? true : false;
      this._signUp(requestBody);
    }
  }

  async _signUp(requestBody: AccountRegister) {
    this.userService.register(requestBody).subscribe(async (response: any) => {
      if (
        response.statusCode === 200 &&
        response.statusMessage == 'Successfully'
      ) {
        if (this.accountType == 'BASIC') {
          this.toastrService.success(
            'Your account is successfully registered. You can now login with this account.',
            'SUCCESS'
          );
          this.router.navigate(['/login']);
        } else if (this.accountType == 'BUSINESS') {
          let title: string =
            'Your account is almost done. Adding your credit card to complete registration.';
          let data: any = {
            username: requestBody.username.toString(),
          };
          this.popupService.openCustomDialog(
            CustomPopupComponent,
            '200px',
            '700px',
            title,
            'isProceedPayment',
            data
          );
        }
      } else if (response.statusCode === 400) {
        this.toastrService.error(response.errors[0].errorMessage, 'ERROR');
      }
    });
  }
}
