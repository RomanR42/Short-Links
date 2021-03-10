import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import {throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetdataService {
  url:string = 'https://api.shrtco.de/v2/shorten?url=';
  constructor(private http: HttpClient) { }

  getData (link:string) {
    let sendLink = this.url + link;
    return this.http.post (sendLink, null)
    .pipe (
      retry(1),
      catchError(this.handleError) 
    )
  }


  handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred.', error.error.message);
      
    } else {
        console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    
    return throwError(
      'Something went wrong... Сheck if the link you entered is correct');
  }

}
