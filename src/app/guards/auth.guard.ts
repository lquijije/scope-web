import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  constructor(public afAuth: AngularFireAuth,
              private router: Router) {
  }
  canActivate() {
    this.currentUser = this.afAuth.auth.currentUser;
    // console.log(this.afAuth.auth.currentUser);
    if (this.currentUser) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
