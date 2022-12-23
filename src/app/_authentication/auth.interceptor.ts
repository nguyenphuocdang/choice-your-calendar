import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, filter, lastValueFrom, Observable, switchMap, take, throwError } from 'rxjs';
import { LocalStorageService } from '../_services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';
import Utils from '../_utils/utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private router : Router, 
        private storageService : LocalStorageService,
        private http: HttpClient,
        private authService: AuthService,
        private toastrService: ToastrService,
        ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //In case the request doesn't any authorization
        if (req.headers.get('No-Auth') === 'True')
        {
           return next.handle(req.clone()); 
        }
        if (req.headers.get('Bearer-Token') === 'Refresh')
        {
            const refreshToken = this.storageService.getRefreshToken();
            req = this.addTokenToHeadersRefresh(req, refreshToken);
            return next.handle(req.clone()); 
        }
        
        //Get the token from the Local Storage
        const accessToken = this.storageService.getAccessToken();
        req = this.addTokenToHeaders(req, accessToken);
        //Catching the errors inside the pipe() operator
        return next.handle(req).pipe(
            catchError(
                error  => 
                {
                    if(error.status === 401)
                    {
                        //expired token
                        if (error.error == 'Access token is expired')
                        {
                            return this.handleExpiredToken(req, next);
                        }
                    }
                    else if (error.status === 403)
                    {
                        //expired token
                        return this.handleExpiredToken(req, next);
                    }
                    else if (error.status === 400)
                    {
                        //return the error data from server
                        return throwError(() => error.error.errors)                     
                    }
                    return throwError(() => `error ${error.error.errors[0].errorCode} ${error.error.errors[0].errorMessage}`)
                }   
           
            )
        );
    }

    private addTokenToHeaders(request: HttpRequest<any>, token : string)
    {
        return request.clone(
            {
                setHeaders: 
                {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    private addTokenToHeadersRefresh(request: HttpRequest<any>, token : string)
    {
        return request.clone(
            {
                setHeaders: 
                {
                    Authorization: `Bearer ${token}`,
                    'isRefreshToken' : 'true',
                }
            }
        )
    }



    private handleExpiredToken(request: HttpRequest<any>, next: HttpHandler)
    {
        if (!this.isRefreshing)
        {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            const refreshToken = this.storageService.getRefreshToken();

            if (refreshToken != null)
            {
                return this.authService.refreshToken(refreshToken).pipe(
                    switchMap((response: any) =>
                    {
                        debugger
                        //status code === 401 -> Refresh token is expired
                        if (response.status === 401 && response.error == 'Access token is expired')
                        {
                            this.toastrService.error('Login session timeout','Error');
                            this.storageService.clearStorage();
                            this.router.navigate(["**"]);
                            return throwError('Refresk token is expired');
                        }
                        //statusCode === 200
                        this.isRefreshing = false;
                        //set new accessToken
                        this.storageService.setAccessToken(response.data.accessToken);
                        //set refreshToken
                        this.storageService.setRefreshToken(response.data.refreshToken);
                        return next.handle(this.addTokenToHeaders(request, response.data.accessToken));
                    }),
                )
            }
        }

        return this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next.handle(this.addTokenToHeaders(request, token)))
          );

    }

    private async refreshingTokens()
    {
        const requestHeader = new HttpHeaders(
            {'Bearer-Token': 'Refresh'},
          )
        const refreshToken: string | null = localStorage.getItem("refreshToken");
        let isRefreshSuccess: boolean = false;
        if (!refreshToken) 
        {
          return false;
        }
        try 
        {
          const response = await lastValueFrom(this.http.get(Utils.AUTH_API + "/refresh-token", 
          {
            headers: requestHeader,
          }));
          if (response != null)
          {        
            const newAccessToken = (<any>response).data.accessToken;
            const newRefreshToken = (<any>response).data.refreshToken;
            this.storageService.setAccessToken(newAccessToken);
            this.storageService.setRefreshToken(newRefreshToken);  
            isRefreshSuccess = true;  
          }
        }
        catch (ex) {
          isRefreshSuccess = false;
        }
        return isRefreshSuccess;
      }
}