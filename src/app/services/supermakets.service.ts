import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ISuperChain } from '../models/supermarkets/super-chain';
import { ISuperStore } from '../models/supermarkets/super-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupermaketsService {

  superChainCollection: AngularFirestoreCollection<ISuperChain>;
  superChainObs: Observable<ISuperChain[]>;
  superChainDoc: AngularFirestoreDocument<ISuperChain>;

  superStoreCollection: AngularFirestoreCollection<ISuperStore>;
  superStoreObs: Observable<ISuperStore[]>;
  superStoreDoc: AngularFirestoreDocument<ISuperStore>;

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore ) {
    this.afs=objafs;
    this.superChainCollection = this.afs.collection<ISuperChain>('super-chain');
    this.superStoreCollection = this.afs.collection<ISuperStore>('super-store');
    this.superChainObs = this.superChainCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISuperChain;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  getSuperChain() {
    return this.superChainObs;
  }

  addSuperChain(superChain: ISuperChain) {
    this.superChainCollection.add(superChain);
  }

  delSuperChain(chain: ISuperChain) {
    this.superChainDoc = this.afs.doc(`super-chain/${chain.id}`);
    this.superChainDoc.delete();
  }

  updSuperChain(chain: ISuperChain) {
    this.superChainDoc = this.afs.doc(`super-chain/${chain.id}`);
    this.superChainDoc.update(chain);
  }

  getSuperStoreFromChain(id: string){
    this.superStoreCollection = this.afs.collection<ISuperStore>('super-store',
    ref => ref.where('cadena','==',id));
    return this.superStoreCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISuperStore;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  addSuperStore(superStore: ISuperStore) {
    this.superStoreCollection.add(superStore);
  }

  delSuperStore(store: ISuperStore) {
    this.superStoreDoc = this.afs.doc(`super-store/${store.id}`);
    this.superStoreDoc.delete();
  }

  updSuperStore(store: ISuperStore) {
    this.superStoreDoc = this.afs.doc(`super-store/${store.id}`);
    this.superStoreDoc.update(store);
  }
}
