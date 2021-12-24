import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  prefixURL = "/api"
  constructor(private http: HttpClient) { }
  signUp(credentials: Object) {
    return this.http.post(this.prefixURL + "/sign-up", credentials).pipe(catchError(this.handleError));
  }
  logIn(credentials: Object) {
    return this.http.post(this.prefixURL + "/log-in", credentials).pipe(catchError(this.handleError));;
  }
  isLoggedIn() {
    return (localStorage.getItem("user") ? true : false)
  }
  logOut() {
    localStorage.removeItem("user");
  }
  private handleError(error: HttpErrorResponse) {
    
    return throwError( () =>
      error);
  }
}
