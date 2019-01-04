import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IUser } from '../models/users/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userCollection: AngularFirestoreCollection<IUser>;
  userObs: Observable<IUser[]>;
  userDoc: AngularFirestoreDocument<IUser>;
  constructor(public afs: AngularFirestore ) {
    this.userObs = afs.collection('users').valueChanges();
  }

  getUsers() {
    return this.userObs;
  }
}
