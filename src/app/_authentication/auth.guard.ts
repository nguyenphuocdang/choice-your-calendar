import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { LocalStorageService } from '../_services/local-storage.service';
import { UserService } from '../_services/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Utils from '../_utils/utils';

const requestHeader = new HttpHeaders(
  {'Bearer-Token': 'Refresh'},
)

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private userService: UserService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastrService: ToastrService,
  ) {}
  navigationExtras: NavigationExtras = {
    state: {
      transd: 'test message',
      workQueue: false,
      services: 10,
      code: '003'
    }
  };
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
    //verify the accessToken
    const accessToken = this.storageService.getAccessToken();
    if (accessToken !== null)
    {
      const role = route.data['role'] as string;    
      if (role) 
      {
        const isMatch = this.userService.roleMatch(role);
        if (isMatch) return true;
        else
        {
          this.router.navigate(['/forbidden']);
          return false;
        }
      }
      return true;  
    } 
    else
    {
      this.router.navigate(['/forbidden']);
    }
    return false;
  }
  
  private async refreshingTokens(accessToken: string): Promise<boolean> {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    let isRefreshSuccess: boolean = false;
    if (!accessToken || !refreshToken) {
      return false;
    }
    try {
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
