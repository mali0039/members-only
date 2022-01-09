import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AccountService } from './account.service';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  prefixURL = "/api"

  postMessage(username: string, message: string) {
    return this.http.post(this.prefixURL + "/message/create", {username, message}).pipe(catchError(this.handleError));;
  }
  getMessages() {
    return this.http.get(this.prefixURL + "/message", { params: {status: this.accountService.getRole() }}).pipe(catchError(this.handleError));
  }
  deleteMessage(id: string) {
    return this.http.delete(this.prefixURL + "/message/delete", {body: {id}}).pipe(catchError(this.handleError));;
  }
  private handleError(error: HttpErrorResponse) {
    
    return throwError( () =>
      error);
  }
  constructor(private http: HttpClient, private accountService: AccountService) { }
}
