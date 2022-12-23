import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountDetail } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  switchToNonRegisteredAccountsFlag: boolean = false;
  public dataSource!: MatTableDataSource<AccountDetail>;
  public dataSourceSecondMode!: MatTableDataSource<any>;
  private dataArray: any[] = [];
  private dataArraySecondMode: any[] = [];
  displayedColumns: string[] = ['id', 'fullname','email','address','gender','pathMapping','image','startDate','endDate'];
  displayedColumnsSecondMode: string[] = ['id', 'fullname','email','address','gender','username','verifyFlag','approve','reject'];
  defaultPage = 0;
  defaultSize = 10;
  pageSizeOptions: number[] = [10];
  totalElements: number = 0;
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
  ) { }


  ngOnInit(): void 
  {
    this.route.params.subscribe(
      () => {
        this._getAllAccounts(this.defaultPage, this.defaultSize)
      })

  }

  _getAllAccounts(page: number, size: number)
  {
    this.adminService.getListAllUser(page, size).subscribe(
      (response: any) => 
      {
        if (response.statusCode === 200 && response.statusMessage == 'Successfully')
        {
          this.dataArray = response.data.content;
          this.dataArray.forEach(element => {
            element.gender = (element.gender == true) ? 'male' : 'female';
            var startDate = new Date(element.effectiveDate).toDateString();
            var endDate = new Date(element.expiredDate).toDateString();
            element.effectiveDate = startDate;
            element.expiredDate = endDate;
          });
          this.dataSource = new MatTableDataSource<any>(this.dataArray);
        }
      }
    )
  }

  _getNonApproveAccounts(page: number, size: number)
  {
    this.adminService.getListnNonApprovedUser(page, size).subscribe(
      (response: any) => 
      {
        if (response.statusCode === 200 && response.statusMessage == 'Successfully')
        {
          this.dataArraySecondMode = response.data.content;
          this.dataArraySecondMode.forEach(element => {
            element.gender = (element.gender == true) ? 'male' : 'female';
            element.verifyFlag = (element.verifyFlag == true) ? 'Already Verified' : 'Not Verified Yet';
          });
          this.dataSourceSecondMode = new MatTableDataSource<any>(this.dataArraySecondMode);
        }
      }
    )
  }

  switchToNonRegisteredAccounts()
  {
    this._getNonApproveAccounts(this.defaultPage, this.defaultSize);
    this.switchToNonRegisteredAccountsFlag = true;
  }

  switchToAllAccounts()
  {
    this._getAllAccounts(this.defaultPage, this.defaultSize);
    this.switchToNonRegisteredAccountsFlag = false;
  }

  approveAccount(id: number)
  {
    this.adminService.approveAccount(id).subscribe(
      (response: any) =>
      {
        if (response.statusCode === 200 && response.statusMessage == 'Successfully')
        {
          debugger
          this.toastrService.success('This account has been approved','SUCCESS 200');

          const indexOfObject = this.dataArraySecondMode.findIndex((object) => {
            return object.id === id;
          });

          if (indexOfObject !== -1) {
            this.dataArraySecondMode.splice(indexOfObject, 1);
            this.dataSourceSecondMode = new MatTableDataSource<any>(this.dataArraySecondMode);
          }
        }
        else 
        {
          this.toastrService.error(response.data[0].errorMessage, '400 ERROR');
        }
      }
    )
  }

  rejectAccount(id: number)
  {
    this.adminService.rejectAccount(id).subscribe(
      (response: any) =>
      {
        if (response.statusCode === 200 && response.statusMessage == 'Successfully')
        {
          debugger
          this.toastrService.success('This account has been reject','SUCCESS 200');

          const indexOfObject = this.dataArraySecondMode.findIndex((object) => {
            return object.id === id;
          });

          if (indexOfObject !== -1) {
            this.dataArraySecondMode.splice(indexOfObject, 1);
            this.dataSourceSecondMode = new MatTableDataSource<any>(this.dataArraySecondMode);
          }
        }
        else 
        {
          this.toastrService.error(response.data[0].errorMessage, '400 ERROR');
        }
      }
    )
  }




}
