import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(public afAuth: AngularFireAuth,
              private router: Router,
          private authServ: AuthService) {
  }
  canActivate(): Observable<boolean> {
    return this.authServ.getAuth()
    .pipe(
      map(auth => {
        if (auth) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
