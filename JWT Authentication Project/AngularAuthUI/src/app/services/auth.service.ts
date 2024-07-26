import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api..model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:44373/api/User/';
  private userPayLoad: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {
    this.userPayLoad = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, userObj);
  }

  refreshToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    // !! are to convert string to boolean value if it is available or not
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const token = this.getToken();

    if (token) {
      return this.jwtHelper.decodeToken(token);
    } else {
      console.error('No token found');
      return null;
    }
  }

  getFullNameFromToken() {
    if (this.userPayLoad) return this.userPayLoad.unique_name;
  }

  getRoleFromToken() {
    if (this.userPayLoad) return this.userPayLoad.role;
  }
}
