import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ICustomer } from '../models/customers/customers';
import { IBrand } from '../models/customers/brands';
import { ISku } from '../models/customers/skus';
import { IAssociatedBrands } from '../models/customers/associated-brands';
import { IAssociatedLogs } from '../models/logs/assoc-logs';
import { Observable } from 'rxjs';
import { map, groupBy } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  customerCollection: AngularFirestoreCollection<ICustomer>;
  customerObs: Observable<ICustomer[]>;
  customerDoc: AngularFirestoreDocument<ICustomer>;

  brandCollection: AngularFirestoreCollection<IBrand>;
  brandObs: Observable<IBrand[]>;
  brandDoc: AngularFirestoreDocument<IBrand>;

  skuCollection: AngularFirestoreCollection<ISku>;
  skuObs: Observable<ISku[]>;
  skuDoc: AngularFirestoreDocument<ISku>;

  asocBrandsCollection: AngularFirestoreCollection<IAssociatedBrands>;
  asocBrandsObs: Observable<IAssociatedBrands[]>;
  asocBrandsDoc: AngularFirestoreDocument<IAssociatedBrands>;

  asocLogsCollection: AngularFirestoreCollection<IAssociatedLogs>;

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore) {
    this.afs = objafs;
    this.customerCollection = this.afs.collection<ICustomer>('customer');
    this.brandCollection = this.afs.collection<IBrand>('brand');
    this.skuCollection = this.afs.collection<ISku>('sku');
    this.asocBrandsCollection = this.afs.collection<IAssociatedBrands>('associated-brands');

    this.customerObs = this.customerCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ICustomer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.brandObs = this.brandCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.skuObs = this.skuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISku;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    this.asocBrandsObs = this.asocBrandsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getCustomer() {
    return this.afs.collection<ICustomer>('customer').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ICustomer;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addCustomer(customer: ICustomer) {
    this.customerCollection = this.afs.collection<ICustomer>('customer');
    return this.customerCollection.add(customer);
  }


  delCustomer(customer: ICustomer) {
    this.customerDoc = this.afs.doc(`customer/${customer.id}`);
    return this.customerDoc.delete();
  }

  updCustomer(customer: ICustomer) {
    this.customerDoc = this.afs.doc(`customer/${customer.id}`);
    return this.customerDoc.update(customer);
  }

  getBrands() {
    return this.brandObs;
  }

  getBrandFromCustomer(customer: string) {
    this.brandCollection = this.afs.collection<IBrand>('brand',
      ref => ref.where('cliente', '==', customer));
    return this.brandCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getBrandById(id: string) {
    return this.afs.doc(`brand/${id}`).ref.get();
  }

  addBrand(brand: IBrand) {
    this.brandCollection = this.afs.collection<IBrand>('brand');
    return this.brandCollection.add(brand);
  }

  delBrand(brand: IBrand) {
    this.brandDoc = this.afs.doc(`brand/${brand.id}`);
    return this.brandDoc.delete();
  }

  updBrand(brand: IBrand) {
    this.brandDoc = this.afs.doc(`brand/${brand.id}`);
    return this.brandDoc.update(brand);
  }

  getSkus() {
    return this.skuObs;
  }

  getSkuFromCustomerAndBrand(customer: string, brand: string) {
    this.skuCollection = this.afs.collection<ISku>('sku',
      ref => ref.where('cliente', '==', customer)
        .where('marca', '==', brand));
    return this.skuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getSkuFromCustomerBrandAndSku(customer: string, brand: string, sku: string) {
    this.skuCollection = this.afs.collection<ISku>('sku',
      ref => ref.where('cliente', '==', customer)
        .where('marca', '==', brand)
        .where('sku', '==', sku));
    return this.skuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addSku(sku: ISku) {
    this.skuCollection = this.afs.collection<ISku>('sku');
    return this.skuCollection.add(sku);
  }

  delSku(sku: ISku) {
    this.skuDoc = this.afs.doc(`sku/${sku.id}`);
    return this.skuDoc.delete();
  }

  updSku(sku: ISku) {
    this.skuDoc = this.afs.doc(`sku/${sku.id}`);
    return this.skuDoc.update(sku);
  }

  getAssociatedBrands() {
    return this.asocBrandsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getAssociatedBrandsGroup() {
    this.asocBrandsCollection = this.afs.collection<IAssociatedBrands>('associated-brands');
  }

  addAssocBrand(assoc: IAssociatedBrands) {
    this.asocBrandsCollection = this.afs.collection<IAssociatedBrands>('associated-brands');
    return this.asocBrandsCollection.add(assoc);
  }
  addAssocLog(assocLogs: IAssociatedLogs) {
    this.asocLogsCollection = this.afs.collection<IAssociatedLogs>('associated-logs');
    return this.asocLogsCollection.add(assocLogs);
  }
  updAssocBrand(assoc: IAssociatedBrands) {
    this.asocBrandsDoc = this.afs.doc(`associated-brands/${assoc.id}`);
    return this.asocBrandsDoc.update(assoc);
  }
  delAssocBrand(assoc: IAssociatedBrands) {
    this.asocBrandsDoc = this.afs.doc(`associated-brands/${assoc.id}`);
    return this.asocBrandsDoc.delete();
  }
  getAssociatedBrandsByAll(chain: string, store: string, customer: string, brand: string) {
    let dataFilCollection: AngularFirestoreCollection<IAssociatedBrands>;
    if(chain && store && customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('cliente', '==', customer)
        .where('local', '==', store)
        .where('marca', '==', brand)
      );
    }
    if(!chain && !store && !customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands');
    }
    if(chain && store && customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('local', '==', store)
        .where('cliente', '==', customer)
      );
    }
    if(chain && store && !customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('local', '==', store)
        .where('marca', '==', brand)
      );
    }
    if(chain && !store && customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('cliente', '==', customer)
        .where('marca', '==', brand)
      );
    }
    if(!chain && store && customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('local', '==', store)
        .where('cliente', '==', customer)
        .where('marca', '==', brand)
      );
    }

    if(chain && store && !customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('local', '==', store)
      );
    }
    if(chain && !store && customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('cliente', '==', customer)
      );
    }
    if(!chain && store && customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('local', '==', store)
        .where('cliente', '==', customer)
      );
    }
    if(chain && !store && !customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
        .where('marca', '==', brand)
      );
    }
    if(!chain && store && !customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('local', '==', store)
        .where('marca', '==', brand)
      );
    }
    if(!chain && !store && customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cliente', '==', customer)
        .where('marca', '==', brand)
      );
    }

    if(chain && !store && !customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cadena', '==', chain)
      );
    }
    if(!chain && store && !customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('local', '==', store)
      );
    }
    if(!chain && !store && customer && !brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('cliente', '==', customer)
      );
    }
    if(!chain && !store && !customer && brand) {
      dataFilCollection = this.afs.collection<IAssociatedBrands>('associated-brands', ref => ref
        .where('marca', '==', brand)
      );
    }

    return dataFilCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getAssocLogByCustomer(desde: any, hasta: any, merchant: string) {
    desde = desde + ' 00:00:00';
    hasta = hasta + ' 23:59:59';
    if (merchant) {
      return this.afs.collection<IAssociatedLogs>('associated-logs', ref => ref
        .where('fecha', '>=', desde)
        .where('fecha', '<=', hasta)
        .where('cliente', '==', merchant)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IAssociatedLogs;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    } else {
      return this.afs.collection<IAssociatedLogs>('associated-logs', ref => ref
        .where('fecha', '>=', desde)
        .where('fecha', '<=', hasta)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as IAssociatedLogs;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    }
  }
}
