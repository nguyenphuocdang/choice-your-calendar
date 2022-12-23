import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import Utils from '../_utils/utils';

const requestHeader = new HttpHeaders(
  {'Bearer-Token': 'Refresh'},
)
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) 
  {}
  
  refreshToken(token: string) {
    return this.http.get(Utils.AUTH_API + '/refresh-token', 
    {
      headers: requestHeader,
    }).pipe(
      map((response: any) =>
        {
          return response;
        }
      ),
      catchError(
        err => 
        {
          return of(err);
        }
      )
    )
  }
}
