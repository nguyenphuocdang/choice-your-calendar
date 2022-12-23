import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-template',
  templateUrl: './popup-template.component.html',
  styleUrls: ['./popup-template.component.css']
})
export class PopupTemplateComponent implements OnInit {

  modalTitle!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private dialogRef: MatDialogRef<PopupTemplateComponent>) 
  { 
    this.modalTitle = data.message ?? '';
  }

  ngOnInit(): void 
  {
  }

  onConfirm()
  {
    this.dialogRef.close(true);
  }

  onCancel()
  {
    this.dialogRef.close(false);
  }
}
