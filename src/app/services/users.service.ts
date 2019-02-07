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
    this.userCollection = afs.collection<IUser>('users');
    this.userObs = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  getUsers() {
    return this.userObs;
  }

  addUser(user: IUser){
    this.userCollection.add(user);
  }

  updUser(user: IUser) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.update(user);
  }
  delUser(user: IUser) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.delete();
  }
}
