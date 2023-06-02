import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/_services/payment.service';
import { PopupService } from 'src/app/_services/popup.service';
import { CustomPopupComponent } from 'src/app/components/popup/custom-popup/custom-popup.component';

@Component({
  selector: 'app-complete-payment',
  templateUrl: './complete-payment.component.html',
  styleUrls: ['./complete-payment.component.scss'],
})
export class CompletePaymentComponent implements OnInit {
  paymentId: string = '';
  payerId: string = '';
  isAuthenticated: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private popupService: PopupService
  ) {
    debugger;
    if (this.activatedRoute.snapshot.queryParamMap.get('paymentId') != null) {
      this.paymentId =
        this.activatedRoute.snapshot.queryParamMap.get('paymentId') ?? '';
      this.payerId =
        this.activatedRoute.snapshot.queryParamMap.get('PayerID') ?? '';
    }
  }

  ngOnInit(): void {
    this._executePayment();
    // this.popupService.openCustomDialog(
    //   CustomPopupComponent,
    //   '200px',
    //   '750px',
    //   'Your account is ready to go. You can login now.',
    //   'isAuthenticated'
    // );
  }

  _executePayment() {
    let requestBody = {
      paymentId: this.paymentId,
      payerId: this.payerId,
    };
    try {
      this.paymentService
        .executePayment(requestBody)
        .subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.popupService.openCustomDialog(
              CustomPopupComponent,
              '200px',
              '750px',
              'Your account is ready to go. You can login now.',
              'isAuthenticated'
            );
          }
        });
    } catch (error) {
      debugger;
    }
  }
}
