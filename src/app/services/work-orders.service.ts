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
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    d.setDate(1);
    let start = d;    
    return this.afs.collection<IWorkOrder>('work-orders', ref => ref
    .where('creacion', '>', start)).snapshotChanges().pipe(
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
    return this.wOrderCollection.add(wOrder);
  }
  addWorkOrder2(wOrder: IWorkOrder) {
    return this.wOrderCollection.add(wOrder);
  }
  updWorkOrder(wOrder: IWorkOrder) {
      this.wOrderDoc = this.afs.doc(`work-orders/${wOrder.id}`);
      return this.wOrderDoc.update(wOrder);
  }
  addWorkOrders(wOrders: IWorkOrder[]) {
      var reads = [];
      wOrders.forEach(w => {
        var promise =  this.wOrderCollection.add(w);
        reads.push(promise);
      });
      return Promise.all(reads);
  }
  delOrder(order: IWorkOrder) {
    this.wOrderDoc = this.afs.doc(`work-orders/${order.id}`);
    return this.wOrderDoc.delete();
  }
}
