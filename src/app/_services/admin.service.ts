import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import Utils from '../_utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getListAllUser(page: number, size: number)
  {
    return this.http.get(
      `${Utils.ADMIN_API}/account/list/all?page=${page}&size=${size}`,
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  getListnNonApprovedUser(page: number, size: number)
  {
    return this.http.get(
      `${Utils.ADMIN_API}/account/list?page=${page}&size=${size}`,
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  approveAccount(registerAccountId: number)
  {
    return this.http.get(
      `${Utils.ADMIN_API}/account/approve/${registerAccountId}`,
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }

  rejectAccount(registerAccountId: number)
  {
    return this.http.get(
      `${Utils.ADMIN_API}/account/deny/${registerAccountId}`,
    ).pipe(
      map((response: any) => 
      {
        return response;
      }),
      catchError(
        err => 
        {
          return err  
        })      
    )
  }



}
