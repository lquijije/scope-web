import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ISuperChain } from '../models/supermarkets/super-chain';
import { ISuperStore } from '../models/supermarkets/super-store';
import { ICustomer } from '../models/customers/customers';
import { IAssociatedBrands } from '../models/supermarkets/associated-brands';
import { IZone } from '../models/supermarkets/zone';
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

  associateCollection: AngularFirestoreCollection<IAssociatedBrands>;

  zoneCollection: AngularFirestoreCollection<IZone>;
  zoneObs: Observable<IZone[]>;
  zoneDoc: AngularFirestoreDocument<IZone>;

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore ) {
    this.afs = objafs;
    this.superChainCollection = this.afs.collection<ISuperChain>('super-chain');
    this.superStoreCollection = this.afs.collection<ISuperStore>('super-store');
    this.zoneCollection = this.afs.collection<IZone>('zone');

    this.superChainObs = this.superChainCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISuperChain;
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

  getSuperStoreFromChain(id: string) {
    this.associateCollection = this.afs.collection<ISuperStore>('super-store',
    ref => ref.where('cadena', '==', id));
    return this.associateCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISuperStore;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  getSuperStoreFromChainAssociate(chainObj: any) {
    this.superStoreCollection = this.afs.collection<IAssociatedBrands>('associated-brands',
      ref => ref.where('cadena', '==', chainObj));
    return this.superStoreCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  getCustomersFromChainStoreAssociate(chainObj: any, storeObj: any) {
    this.associateCollection = this.afs.collection<IAssociatedBrands>('associated-brands',
      ref => ref.where('cadena', '==', chainObj)
        .where('local', '==', storeObj));
    return this.associateCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getBrandsFromChainStoreCustomerAssociate(chainObj: any, storeObj: any, customerObj: any) {
    this.associateCollection = this.afs.collection<IAssociatedBrands>('associated-brands',
      ref => ref.where('cadena', '==', chainObj)
        .where('local', '==', storeObj)
        .where('cliente', '==', customerObj));
    return this.associateCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getSkusFromChainStoreCustomerBrandAssociate(chainObj: any, storeObj: any, customerObj: any, brandObj: any) {
    this.associateCollection = this.afs.collection<IAssociatedBrands>('associated-brands',
      ref => ref.where('cadena', '==', chainObj)
        .where('local', '==', storeObj)
        .where('cliente', '==', customerObj)
        .where('marca', '==', brandObj));
    return this.associateCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
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


  getZone() {
    console.log('getZone');
    return this.zoneObs;
  }

  addZone(zone: IZone) {
    this.zoneCollection.add(zone);
  }

  delZone(zone: IZone) {
    this.zoneDoc = this.afs.doc(`zone/${zone.id}`);
    this.zoneDoc.delete();
  }

  updZone(zone: IZone) {
    this.zoneDoc = this.afs.doc(`zone/${zone.id}`);
    this.zoneDoc.update(zone);
  }
}
