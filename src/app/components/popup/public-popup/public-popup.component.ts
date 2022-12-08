import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-public-popup',
  templateUrl: './public-popup.component.html',
  styleUrls: ['./public-popup.component.css']
})
export class PublicPopupComponent implements OnInit {
  modalTitle!: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) 
  { 
    this.modalTitle = data.title;
  }

  

  ngOnInit(): void {}


}
