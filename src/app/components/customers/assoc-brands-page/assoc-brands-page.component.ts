import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISku } from '../../../models/customers/skus';
import { CustomerService } from '../../../services/customer.service';
import { SupermaketsService } from '../../../services/supermakets.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
// import * as $ from 'jquery';
import { IAssociatedBrands } from 'src/app/models/customers/associated-brands';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-assoc-brands-page',
  templateUrl: './assoc-brands-page.component.html',
  styleUrls: ['./assoc-brands-page.component.css']
})
export class AssocBrandsPageComponent implements OnInit, OnDestroy {
  customerList: any;
  brandList: any;
  chainList: any;
  storeList: any;
  skuList: any;
  assocBrandList: any;
  tempIdChain: string;
  tempNameChain: string;
  tempIdStore: string;
  tempNameStore: string;
  tempIdCustomer: string;
  tempNameCustomer: string;
  tempIdBrand: string;
  tempNameBrand: string;
  editState: any = false;
  actionName: string = '';
  associatedBrand: IAssociatedBrands = {
      cadena: {
        id: '',
        nombre: ''
      },
      local: {
        id:'',
        nombre:''
      },
      cliente: {
        id:'',
        razonsocial:''
      },
      marca: {
        id:'',
        nombre:''
      },
      sku: []
  }
  assocBrandDetail: any = {
    cadena: '',
    local: '',
    cliente: '',
    marca: '',
    sku: []
  };
  customerSubscription: Subscription;
  superChainSubscription: Subscription;
  assocSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private cs: CustomerService,
    private sc: SupermaketsService) { }

  ngOnInit() {
    var self = this;
    $('#cmbChain').on('select2:select',function(e){
      var idChain = e.params.data.id;
      var nameChain = e.params.data.text;
      if (idChain!=''){
        self.tempIdChain = idChain;
        self.tempNameChain = nameChain;
        self.sc.getSuperStoreFromChain(idChain).subscribe(stores => {      
          self.storeList = stores;
        });
      }
    });
    $('#cmbStore').on('select2:select',function(e){
      var idStore = e.params.data.id;
      var nameStore = e.params.data.text;
      if (idStore!=''){ 
        self.tempIdStore = idStore;
        self.tempNameStore = nameStore;
      }
    });
    $('#cmbCustomer').on('select2:select',function(e){
      var idCustomer = e.params.data.id;
      var nameCustomer = e.params.data.text;
      if (idCustomer!=''){
        self.tempIdCustomer = idCustomer;
        self.tempNameCustomer = nameCustomer;
        self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {      
          self.brandList = brands;
        });
      }
    });
    $('#cmbBrand').on('select2:select',function(e){
      if(self.tempIdCustomer!=''){
        var idBrand = e.params.data.id;
        var nameBrand = e.params.data.text;
        if (idBrand!=''){
          self.tempIdBrand = idBrand;
          self.tempNameBrand = nameBrand;
          self.cs.getSkuFromCustomerAndBrand(self.tempIdCustomer, idBrand).subscribe(skus => {
            self.skuList = skus;
          });
        }
      }else{
        this.openAlert('Scope Alert','Escoja un cliente');
      }
    });
    this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
    this.superChainSubscription = this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.assocSubscription = this.cs.getAssociatedBrands().subscribe(assocBrands => {
      this.assocBrandList = assocBrands;
    });
  }
  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
    this.superChainSubscription.unsubscribe();
    this.assocSubscription.unsubscribe();
  }
  onSubmit(myForm: NgForm){
    if($('#cmbChain').val()!=''){
      if($('#cmbStore').val()!=''){
        if($('#cmbCustomer').val()!=''){
          if($('#cmbBrand').val()!=''){
            if (!this.editState) {
              this.associatedBrand.cliente = {
                id: this.tempIdCustomer,
                razonsocial: this.tempNameCustomer
              };
              this.associatedBrand.marca = {
                id: this.tempIdBrand,
                nombre: this.tempNameBrand
              };
              this.associatedBrand.cadena = {
                id: this.tempIdChain,
                nombre: this.tempNameChain
              };
              this.associatedBrand.local = {
                id: this.tempIdStore,
                nombre: this.tempNameStore
              };
              this.associatedBrand.sku = this.skuList;
              this.cs.addAssocBrand(this.associatedBrand);
            } else {
              //this.cs.updSku(this.associatedBrand);
              this.editState = false;
            }
            this.clearObject();
            this.salir();            
          }else{
            this.openAlert('Scope Alert!', 'Debe escojer una Marca');
          }
        }else{
          this.openAlert('Scope Alert!', 'Debe escojer un Cliente');
        }
      }else{
        this.openAlert('Scope Alert!', 'Debe escojer un Local');
      }
    }else{
      this.openAlert('Scope Alert!', 'Debe escojer una Cadena');
    }
  }
  nuevo(){
    this.showEditView();
  }
  deleteSku(sku: ISku) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea excluir el SKU ' + sku.sku + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index: number = this.skuList.indexOf(sku);
        if (index !== -1) {
          this.skuList.splice(index, 1);
        } 
      }
    });
  }
  delete(assoc: IAssociatedBrands) {
   /* const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar la Asociaci&oacute;n selecionada?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {*/
        // this.cs.updBrand(brand); // Cambia estado a I
        this.cs.delAssocBrand(assoc); // Elimina permanentemente de la base
     /*}
    });*/
  }
  details(assoc: IAssociatedBrands){
    this.assocBrandDetail = assoc;
    this.showDetailView();
    console.log(this.assocBrandDetail);
  }
  salir(){
    this.closeEditView();
    this.clearObject();
  }
  showEditView() {
    if(!this.editState){
      this.actionName = 'Nueva';
    }else{
      this.actionName = 'Editar';
    }
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
    var n1 = new Option('', '', true, true);
    $('#cmbChain').append(n1).trigger('change');
    $('#cmbChain').select2({
      placeholder: "Seleccione Cadena",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
    var n2 = new Option('', '', true, true);
    $('#cmbCustomer').append(n2).trigger('change');
    $('#cmbCustomer').select2({
      placeholder: "Seleccione Cliente",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
    var n3 = new Option('', '', true, true);
    $('#cmbStore').append(n3).trigger('change');
    $('#cmbStore').select2({
      placeholder: "Seleccione Local",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
    var n4 = new Option('', '', true, true);
    $('#cmbBrand').append(n4).trigger('change');
    $('#cmbBrand').select2({
      placeholder: "Seleccione Marca",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
  }
  showDetailView(){
    this.actionName = 'Detalle';
    $('#pnlDetail').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  closeEditView() {
    $('#pnlEdit').addClass('d-none');
    $('#pnlDetail').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  clearObject() {
    this.editState = false;
    this.skuList = [];
    this.storeList = [];
    this.brandList = [];
    this.associatedBrand = {
      cadena: {
        id: '',
        nombre: ''
      },
      local: {
        id:'',
        nombre:''
      },
      cliente: {
        id:'',
        razonsocial:''
      },
      marca: {
        id:'',
        nombre:''
      },
      sku: []
    };
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { title: tit , msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
