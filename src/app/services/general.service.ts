import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ICity } from '../models/general/general';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
 cityCollection: AngularFirestoreCollection<ICity>;
 cityObs: Observable<ICity[]>;
 cityDoc: AngularFirestoreDocument<ICity>;
  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore) {
    this.afs=objafs;
    this.cityCollection = this.afs.collection<ICity>('city');
    this.cityObs = this.cityCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ICity;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
   }
   getCity() {
    return this.cityObs;
  }
}
