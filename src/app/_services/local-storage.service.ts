import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/angular';

const ROLE_KEY = 'role'
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const EMAIL = 'email'
const ACTIVE_CALENDAR = 'activeCalendar'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private http: HttpClient) 
  {}
  
  public setAccessToken(accessToken: string)
  {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  public setRefreshToken(refreshToken: string)
  {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getAccessToken() : string
  {
    return localStorage.getItem(ACCESS_TOKEN_KEY)!;
  }

  public getRefreshToken() : string
  {
    return localStorage.getItem(REFRESH_TOKEN_KEY)!;
  }

  public clearStorage()
  {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(ACTIVE_CALENDAR);
  }

  public isLoggedIn()
  {
    return this.getAccessToken();
  }

  public setRole(role: string)  
  {
    return localStorage.setItem(ROLE_KEY,role);
  }

  public getRole() : string{
    return localStorage.getItem(ROLE_KEY)!;
  }

  public setEmail(email: string)  
  {
    return localStorage.setItem(EMAIL,email);
  }

  public getEmail() : string{
    return localStorage.getItem(EMAIL)!;
  }
  
  public setActiveCalendar(activeCalendar: EventInput[])
  {
    return localStorage.setItem(ACTIVE_CALENDAR,JSON.stringify(activeCalendar));
  }

  public getActiveCalendar() : EventInput[] 
  {
    return JSON.parse(localStorage.getItem(ACTIVE_CALENDAR)!);
  }

}
