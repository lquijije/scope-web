import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ICreateSession } from '../models/users/rest-firebase';
import { IDeleteAccount } from '../models/users/rest-firebase';
import { IAccountInfo } from '../models/users/rest-firebase';
const endpoint = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class FirebaseRestService {

  constructor(private http: HttpClient) { }
  private extractData(res: Response) {
    const body = res;
    return body || {};
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  createSession(email: string, password: string): Observable<ICreateSession> {
    const method = 'verifyPassword';
    const url = endpoint + method + '?key=' + environment.firebaseConfig.apiKey;
    const body = {
      'email': email,
      'password': password,
      'returnSecureToken': true
    };
    return this.http.post<ICreateSession>(url, JSON.stringify(body), httpOptions)
    .pipe(
          tap(_ => {} ),
          catchError(this.handleError<any>('createSession'))
         );
  }

  deleteAccount(idToken: string): Observable<IDeleteAccount> {
    const method = 'deleteAccount';
    const url = endpoint + method + '?key=' + environment.firebaseConfig.apiKey;
    const body = {
      'idToken': idToken
    };
    return this.http.post<IDeleteAccount>(url, JSON.stringify(body), httpOptions)
      .pipe(tap(_ => {}),
        catchError(this.handleError<any>('deleteAccount'))
      );
  }
  updateProfile(idToken: string, name: string): Observable<IAccountInfo> {
    const method = 'setAccountInfo';
    const url = endpoint + method + '?key=' + environment.firebaseConfig.apiKey;
    const body = {
      'idToken': idToken,
      'displayName': name,
      'photoUrl': '',
      'returnSecureToken': true
    };
    return this.http.post<IAccountInfo>(url, JSON.stringify(body), httpOptions)
      .pipe(tap(_ => { }),
        catchError(this.handleError<any>('setAccountInfo'))
      );
  }

}
