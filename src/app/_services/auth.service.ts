import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

const AUTH_API = 'http://localhost:8000/api/auth';
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
    return this.http.get(AUTH_API + '/refresh-token', 
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
