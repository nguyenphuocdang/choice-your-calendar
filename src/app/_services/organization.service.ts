import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, throwError } from 'rxjs';
import Utils from '../_utils/utils';
import { ApiResponse, DataListResponse } from '../_models/response';
import { UserBusinessDetail } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) {}
  createOrganization(requestBody: any): Observable<any> {
    return this.http.post(`${Utils.ORGANIZATION_API}/add`, requestBody).pipe(
      map((response: any) => {
        if (response.statusCode == 200) {
          return response;
        }
      }),
      catchError((err) => {
        debugger;
        return 'create organization error';
      })
    );
  }
  async getOrganizationDetailPromise() {
    try {
      const requestUrl = `${Utils.ORGANIZATION_API}/detail`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      return 'get organization detail error';
    }
  }

  addEmployee(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http
      .post(`${Utils.ORGANIZATION_API}/user/upload`, formData)
      .pipe(
        map((response: any) => {
          if (response.statusCode == 200) {
            return response;
          }
        }),
        catchError((err) => {
          debugger;
          return 'add employee error';
        })
      );
  }

  async getEmployee() {
    try {
      const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=10&pageNumber=10&pageSize=10&paged=true&sort.sorted=true&sort.unsorted=false&unpaged=false`;
      const response: any = await lastValueFrom(this.http.get(requestUrl));
      return response;
    } catch (error) {
      debugger;
      return 'get employee detail error';
    }
  }

  getUserInOrganization(
    offset?: number,
    pageNumber?: number,
    pageSize?: number,
    paged?: boolean,
    sorted?: boolean,
    unsorted?: boolean,
    unpaged?: boolean
  ): Observable<ApiResponse<DataListResponse<UserBusinessDetail[]>>> {
    // const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=${offset}&pageNumber=${pageNumber}&pageSize=${pageSize}&paged=${paged}&sort.sorted=${sorted}&sort.unsorted=${unsorted}&unpaged=${unsorted}`;
    const requestUrl = `${Utils.ORGANIZATION_API}/user/get-all-user-of-organization?offset=10&pageNumber=10&pageSize=10&paged=true&sort.sorted=true&sort.unsorted=false&unpaged=false`;
    return this.http
      .get<ApiResponse<DataListResponse<UserBusinessDetail[]>>>(requestUrl)
      .pipe(
        map((response: ApiResponse<DataListResponse<UserBusinessDetail[]>>) => {
          return response;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }
}
