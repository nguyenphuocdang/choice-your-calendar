import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../_models/user';

const ROLE_KEY = 'role';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EMAIL = 'email';
const ACTIVE_CALENDAR = 'activeCalendar';
const AUTHORIZATION_CODE = 'authorizationCode';
const USER = 'USER';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private http: HttpClient) {}

  AUTHORIZATION_CODE = 'authorizationCode';

  itemValue = new BehaviorSubject(this.AUTHORIZATION_CODE);

  set theItem(value) {
    this.itemValue.next(value!); // this will make sure to tell every subscriber about the change.
    localStorage.setItem('theItem', value!);
  }

  get theItem() {
    return localStorage.getItem('theItem');
  }

  public setAuthorizationCode(code: string) {
    this.itemValue.next(code);
    localStorage.setItem(this.AUTHORIZATION_CODE, code);
  }

  public getAuthorizationCode() {
    return localStorage.getItem(this.AUTHORIZATION_CODE);
  }

  public setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getAccessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN_KEY)!;
  }

  public getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN_KEY)!;
  }

  public clearStorage() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER);
    localStorage.removeItem(ACTIVE_CALENDAR);
  }

  public isLoggedIn() {
    return this.getAccessToken();
  }

  public setRole(role: string) {
    return localStorage.setItem(ROLE_KEY, role);
  }

  public getRole(): string {
    return localStorage.getItem(ROLE_KEY)!;
  }

  public setEmail(email: string) {
    return localStorage.setItem(EMAIL, email);
  }

  public getEmail(): string {
    return localStorage.getItem(EMAIL)!;
  }

  public setUserProfile(data: UserProfile) {
    return localStorage.setItem(USER, JSON.stringify(data));
  }

  public getUserProfile(): UserProfile {
    const user = localStorage.getItem(USER) ?? '';
    const userParse = JSON.parse(user) as UserProfile;
    return userParse;
  }

  public setActiveCalendar(activeCalendar: EventInput[]) {
    return localStorage.setItem(
      ACTIVE_CALENDAR,
      JSON.stringify(activeCalendar)
    );
  }

  public getActiveCalendar(): EventInput[] {
    return JSON.parse(localStorage.getItem(ACTIVE_CALENDAR)!);
  }
}
