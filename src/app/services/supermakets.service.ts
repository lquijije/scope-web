import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ISuperChain } from '../models/supermarkets/super-chain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupermaketsService {

  superChainCollection: AngularFirestoreCollection<ISuperChain>;
  superChainObs: Observable<ISuperChain[]>;
  superChainDoc: AngularFirestoreDocument<ISuperChain>;
  constructor(public afs: AngularFirestore ) {

    this.superChainCollection = afs.collection<ISuperChain>('super-chain');
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
}
