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

  getWorkOrdersList(desde: string, hasta: string, condicion: string) {
    if(condicion == 'creacion') {
      desde = desde + ' 00:00:00';
      hasta = hasta + ' 23:59:59';
      console.log(desde);
      console.log(hasta);
      return this.afs.collection<IWorkOrder>('work-orders', ref => ref
      .where(condicion, '>=', new Date(desde))
      .where(condicion, '<=', new Date(hasta))
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    } else {
      desde = desde + ' 00:00:00';
      hasta = hasta + ' 23:59:59';
      console.log(desde);
      console.log(hasta);
      return this.afs.collection<IWorkOrder>('work-orders', ref => ref
      .where(condicion, '>=', desde)
      .where(condicion, '<=', hasta)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    }
  }

  getWorkOrdersListFinalized(desde: string, hasta: string, condicion: string) {
    if(condicion == 'creacion') {
      desde = desde + ' 00:00:00';
      hasta = hasta + ' 23:59:59';
      
      return this.afs.collection<IWorkOrder>('work-orders', ref => ref
      .where(condicion, '>=', new Date(desde))
      .where(condicion, '<=', new Date(hasta))
      .where('estado', '==', {"id": "kq5JBF6UyK26E2S7fEz1","nombre": "FINALIZADA"})
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    } else {
      desde = desde + ' 00:00:00';
      hasta = hasta + ' 23:59:59';
      return this.afs.collection<IWorkOrder>('work-orders', ref => ref
      .where(condicion, '>=', desde)
      .where(condicion, '<=', hasta)
      .where('estado', '==', {"id": "kq5JBF6UyK26E2S7fEz1","nombre": "FINALIZADA"})
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IWorkOrder;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    }
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
