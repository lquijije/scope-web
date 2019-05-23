import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IUser } from '../models/users/user';
import { IProfile } from '../models/users/profile';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userCollection: AngularFirestoreCollection<IUser>;
  userObs: Observable<IUser[]>;
  userDoc: AngularFirestoreDocument<IUser>;

  profileCollection: AngularFirestoreCollection<IProfile>;
  profileObs: Observable<IProfile[]>;

  merchantCollection: AngularFirestoreCollection<IUser>;

  constructor(public afs: AngularFirestore ) {
    this.userCollection = afs.collection<IUser>('users');
    this.profileCollection = afs.collection<IProfile>('profile');

    this.userObs = this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

    this.profileObs = this.profileCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  getUsers() {
  this.userCollection = this.afs.collection<IUser>('users');
    return this.userCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getUserByEmail(email: string) {
    let userByEmailCollection: AngularFirestoreCollection<IUser>;
    userByEmailCollection = this.afs.collection<IUser>('users',
      ref => ref.where('email', '==', email));
    return userByEmailCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getProfiles() {
    return this.profileObs;
  }

  addUser(user: IUser) {
    this.userCollection.add(user);
    this.getUserByEmail(user.email).subscribe(users => {
      const newUser = users[0];
      this.updUser(newUser);
    });
  }

  updUser(user: IUser) {
    return new Promise((resolve, reject) => {
      this.userDoc = this.afs.doc(`users/${user.id}`);
      this.userDoc.update(user).then(
        (voidRes) => {},
        err => reject(err)
      );
    });
  }
  delUser(user: IUser) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.delete();
  }

  getMerchants() {
    this.merchantCollection = this.afs.collection<IUser>('users',
    ref => ref.where('perfil', 'array-contains',
    {
      id: 'fekR2vrdZHB5VkywvIL4',
      nombre: 'Mercaderista'
    }));
    return this.merchantCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
}
