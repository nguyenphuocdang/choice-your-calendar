import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { PopupTemplateComponent } from '../components/popup/popup-template/popup-template.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  $isConfirm = new BehaviorSubject<boolean>(false);
  isConfirm: boolean = false;

  confirmPopup(dialog: MatDialog, message: string) 
  {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = 
      {
        message: message,
      }
      const dialogRef = dialog.open(PopupTemplateComponent, dialogConfig); 
      
      dialogRef.afterClosed().subscribe((confirmed: boolean) => 
      {
          if (confirmed) 
          {
            this.isConfirm = true;
            this.$isConfirm.next(true);  
          }
          else 
          {
            this.isConfirm = false;
            this.$isConfirm.next(false);  
          }
      });
  }

  openNewTabAfterClose(url: string)
  {
    this.$isConfirm.subscribe(
      (isConfirm) => 
      {
        if (this.isConfirm)
        {
          window.open(url, "_blank");
          this.isConfirm = false;
        }
      }
    )
  }
}
