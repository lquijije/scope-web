import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { IWorkOrder } from '../models/work-orders/work-order';
import { IOrderStatus } from '../models/work-orders/order-status';
import { Observable } from 'rxjs';
import { map, groupBy } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  wOrderCollection: AngularFirestoreCollection<IWorkOrder>;
  wOrderObs: Observable<IWorkOrder[]>;
  wOrderDoc: AngularFirestoreDocument<IWorkOrder>;

  oStatusCollection: AngularFirestoreCollection<IOrderStatus>;
  oStatusObs: Observable<IOrderStatus[]>;
  oStatusDoc: AngularFirestoreDocument<IOrderStatus>;

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore) {
    this.afs = objafs;
    this.wOrderCollection = this.afs.collection<IWorkOrder>('work-orders');
    this.oStatusCollection = this.afs.collection<IWorkOrder>('order-status');

    this.wOrderObs = this.wOrderCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IWorkOrder;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
    this.oStatusObs = this.oStatusCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IOrderStatus;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  getWorkOrders() {
    return this.wOrderObs;
  }

  getWorkOrdersList() {
    return this.afs.collection<IWorkOrder>('work-orders').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IWorkOrder;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getOrderStatus() {
    return this.oStatusObs;
  }
  addWorkOrder(wOrder: IWorkOrder) {
    return new Promise((resolve, reject) => {
      this.wOrderCollection.add(wOrder).then(
        data => resolve('OK'),
        err => reject(err)
      );
    });
  }
  updWorkOrder(wOrder: IWorkOrder) {
    return new Promise((resolve, reject) => {
      this.wOrderDoc = this.afs.doc(`work-orders/${wOrder.id}`);
      this.wOrderDoc.update(wOrder).then(
        (voidRes) => { },
        err => reject(err)
      );
    });
  }
  addWorkOrders(wOrders: IWorkOrder[]) {
    return new Promise((resolve, reject) => {
      wOrders.forEach(w => {
        this.wOrderCollection.add(w).then(
          data => {
            w['generada'] = true;
            resolve('OK');
          },
          err => {
            w['generada'] = false;
            reject(err);
          }
        );
      });
    });
  }
  delOrder(order: IWorkOrder) {
    this.wOrderDoc = this.afs.doc(`work-orders/${order.id}`);
    return this.wOrderDoc.delete();
  }
}
