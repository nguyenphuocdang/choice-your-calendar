import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { socketRequest } from '../_models/request';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../_models/response';
import Utils from '../_utils/utils';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private http: HttpClient) {}

  sendPublicMessage(requestBody: socketRequest): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(
        `${Utils.SOCKET_API}/send-public-message`,
        requestBody
      )
      .pipe(
        map((response: ApiResponse<any>) => {
          debugger;
          return response;
        }),
        catchError((error: any) => {
          // handle error
          debugger;
          return throwError(error);
        })
      );
  }

  sendPrivateMessage() {}
}
