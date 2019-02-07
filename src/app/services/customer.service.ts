import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ICustomer } from '../models/customers/customers';
import { IBrand } from '../models/customers/brands';
import { ISku } from '../models/customers/skus';
import { IAssociatedBrands } from '../models/customers/associated-brands';
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

  afs: AngularFirestore;
  constructor(public objafs: AngularFirestore) {
    this.afs=objafs;
    this.customerCollection = this.afs.collection<ICustomer>('customer');
    this.brandCollection = this.afs.collection<IBrand>('brand');
    this.skuCollection = this.afs.collection<ISku>('sku');
    this.asocBrandsCollection = this.afs.collection<IAssociatedBrands>('associated-brands');

    this.customerObs = this.customerCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ICustomer;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

    this.brandObs = this.brandCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

    this.skuObs = this.skuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ISku;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

    this.asocBrandsObs = this.asocBrandsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IAssociatedBrands;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  getCustomer() {
    return this.customerObs;
  }

  addCustomer(customer: ICustomer) {
    this.customerCollection.add(customer);
  }

  delCustomer(customer: ICustomer) {
    this.customerDoc = this.afs.doc(`customer/${customer.id}`);
    this.customerDoc.delete();
  }

  updCustomer(customer: ICustomer) {
    this.customerDoc = this.afs.doc(`customer/${customer.id}`);
    this.customerDoc.update(customer);
  }

  getBrands() {
    return this.brandObs;
  }

  getBrandFromCustomer(customer: string){
    this.brandCollection = this.afs.collection<IBrand>('brand',
    ref => ref.where('cliente','==',customer));
    return this.brandCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }

  addBrand(brand: IBrand) {
    this.brandCollection.add(brand);
  }

  delBrand(brand: IBrand) {
    this.brandDoc = this.afs.doc(`brand/${brand.id}`);
    this.brandDoc.delete();
  }

  updBrand(brand: IBrand) {
    this.brandDoc = this.afs.doc(`brand/${brand.id}`);
    this.brandDoc.update(brand);
  }

  getSkus(){
    return this.skuObs;
  }

  getSkuFromCustomerAndBrand(customer: string, brand: string){
    this.skuCollection = this.afs.collection<ISku>('sku',
    ref => ref.where('cliente','==',customer)
              .where('marca','==',brand));
    return this.skuCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IBrand;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );
  }
  addSku(sku: ISku) {
    this.skuCollection.add(sku);
  }

  delSku(sku: ISku) {
    this.skuDoc = this.afs.doc(`sku/${sku.id}`);
    this.skuDoc.delete();
  }

  updSku(sku: ISku) {
    this.skuDoc = this.afs.doc(`sku/${sku.id}`);
    this.skuDoc.update(sku);
  }

  getAssociatedBrands(){
    return this.asocBrandsObs;
  }

  getAssociatedBrandsGroup(){
    this.asocBrandsCollection = this.afs.collection<IAssociatedBrands>('associated-brands');
  }

  addAssocBrand(assoc: IAssociatedBrands){
    this.asocBrandsCollection.add(assoc);
  }
  delAssocBrand(assoc: IAssociatedBrands) {
    this.asocBrandsDoc = this.afs.doc(`associated-brands/${assoc.id}`);
    this.asocBrandsDoc.delete();
  }
}
