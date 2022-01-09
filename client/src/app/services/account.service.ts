import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  prefixURL = "/api"
  constructor(private http: HttpClient, private router: Router) { }
  signUp(credentials: Object) {
    return this.http.post(this.prefixURL + "/signup", credentials).pipe(catchError(this.handleError));
  }
  logIn(credentials: Object) {
    return this.http.post(this.prefixURL + "/login", credentials).pipe(catchError(this.handleError));;
  }
  isLoggedIn() {
    return (localStorage.getItem("user") ? true : false)
  }
  logOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    return this.http.post(this.prefixURL + "/logout", {}).pipe(catchError(this.handleError));;
  }
  setUsername(username: string) {
    localStorage.setItem("user", username)
  }
  setRole(role: string) {

    localStorage.setItem("role", role);
  }
  changeMembership(user: string) {
    return this.http.post(this.prefixURL + "/member", {user}).pipe(catchError(this.handleError));
  }
  getRole() {
    return localStorage.getItem("role") || "";
  }
  getUsername() {
    return localStorage.getItem("user") || "";
  }
  private handleError(error: HttpErrorResponse) {
    
    return throwError( () =>
      error);
  }
}
