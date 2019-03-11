import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ICity } from '../models/general/general';
import { IPriority } from '../models/general/general';
import { IZone } from '../models/supermarkets/zone';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
 cityCollection: AngularFirestoreCollection<ICity>;
 cityObs: Observable<ICity[]>;
 cityDoc: AngularFirestoreDocument<ICity>;
 zoneCollection: AngularFirestoreCollection<IZone>;
 zoneObs: Observable<IZone[]>;
 zoneDoc: AngularFirestoreDocument<IZone>;
 priorityCollection: AngularFirestoreCollection<IPriority>;
 priorityObs: Observable<IPriority[]>;

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore) {
    this.afs=objafs;
    this.cityCollection = this.afs.collection<ICity>('city');
    this.priorityCollection = this.afs.collection<IPriority>('priority');
    this.zoneCollection = this.afs.collection<IZone>('zone');

    this.cityObs = this.cityCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ICity;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
    this.zoneObs = this.zoneCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IZone;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
    this.priorityObs = this.priorityCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IPriority;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
   }
   getCity() {
    return this.cityObs;
   }
   getZone() {
    return this.zoneObs;
   }
   getPriority() {
    return this.priorityObs;
   }
}
