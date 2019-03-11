import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private secondaryApp = firebase.initializeApp(environment.firebaseConfig, 'Secondary');
  constructor(
    public afAuth: AngularFireAuth
  ) { }

  // registerUser(email: string, pass: string) {
  //   return new Promise((resolve, reject) => {
  //     this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
  //     .then( userData => resolve(userData),
  //     err => reject (err));
  //   });
  // }

  registerUser(email: string, pass: string, nom: string) {
    return new Promise((resolve, reject) => {
      this.secondaryApp.auth().createUserWithEmailAndPassword(email, pass)
        .then(userData => {
          resolve(userData);
          userData.user.updateProfile({
            displayName: nom,
            photoURL: ''
          });
         },
          err => reject(err));
      this.secondaryApp.auth().signOut();
    });
  }

  loginUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
          err => reject(err));
    });
  }

  getAuth() {
    return this.afAuth.authState.pipe(map ( auth => auth ));
  }
  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  // getUser() {
  //   return this.afAuth.auth.currentUser;
  // }

  logout() {
    return this.afAuth.auth.signOut();
  }
}
