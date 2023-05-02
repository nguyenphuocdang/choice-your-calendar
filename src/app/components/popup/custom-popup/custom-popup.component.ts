import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/_services/payment.service';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss'],
})
export class CustomPopupComponent implements OnInit {
  modalTitle!: string;
  isProceedPayment: boolean = false;
  isAuthenticated: boolean = false;
  isBasic: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<CustomPopupComponent>
  ) {
    this.modalTitle = data.title;
    this.isAuthenticated =
      data.optionalFlag === 'isAuthenticated' ? true : false;
    this.isProceedPayment =
      data.optionalFlag === 'isProceedPayment' ? true : false;
  }

  ngOnInit(): void {}

  onConfirm() {}

  onCancel() {}

  async onProceedPayment() {
    if (this.data.optionalData.username != null) {
      try {
        const approveUrl: any = await this.paymentService.getApprovalUrl(
          this.data.optionalData.username
        );
        window.location.href = approveUrl;
      } catch (ex) {
        // do something here
      }
    }
  }

  onProceedLogin() {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
}
