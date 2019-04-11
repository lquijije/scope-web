import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IMenu } from '../models/menu/menu';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuCollection: AngularFirestoreCollection<IMenu>;
  menuObs: Observable<IMenu[]>;
  menuDoc: AngularFirestoreDocument<IMenu>;
  constructor(public afs: AngularFirestore) {
    this.menuCollection = afs.collection<IMenu>('menu');
  }
  getMenuByProfile(profile: any) {
    this.menuCollection = this.afs.collection<IMenu>('menu',
      ref => ref.where('profile', 'array-contains', profile));

    return this.menuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IMenu;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
