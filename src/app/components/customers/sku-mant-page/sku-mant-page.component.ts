import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISku } from '../../../models/customers/skus';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
// import * as $ from 'jquery';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-sku-mant-page',
  templateUrl: './sku-mant-page.component.html',
  styleUrls: ['./sku-mant-page.component.css']
})
export class SkuMantPageComponent implements OnInit, OnDestroy {
  customerList: any;
  brandList: any;
  skuList: any;
  sku: ISku = {
    cliente: '',
    marca: '',
    sku: '',
    descripcion: '',
    presentacion: '',
    sabor: '',
    estado: 'A'
  };
  editState: any = false;
  tempIdCustomer: string = '';
  tempNameCustomer: string = '';
  tempIdBrand: string = '';
  tempNameBrand: string = '';
  actionName:string ='';
  customerSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private cs: CustomerService) { }

  ngOnInit() {
    const self = this;
    const n1 = new Option('', '', true, true);
    $('#cmbCustomer').append(n1).trigger('change');
    $('#cmbCustomer').select2({
      placeholder: 'Seleccione Cliente',
      language: {
          'noResults': function () {
              return '';
          }
      }
    });
    const n2 = new Option('', '', true, true);
    $('#cmbBrand').append(n2).trigger('change');
    $('#cmbBrand').select2({
      placeholder: 'Seleccione Marca',
      language: {
          'noResults': function () {
              return '';
          }
      }
    });
    $('#cmbCustomer').on('select2:select', function(e) {
      const idCustomer = e.params.data.id;
      const nameCustomer = e.params.data.text;
      if (idCustomer != '') {
        self.tempIdCustomer = idCustomer;
        self.tempNameCustomer = nameCustomer;
        self.skuList = [];
        self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
          self.brandList = brands;
          const n3 = new Option('', '', true, true);
          $('#cmbBrand').append(n3).trigger('change');
        });
      }
    });
    $('#cmbBrand').on('select2:select', function(e) {
      if(self.tempIdCustomer != '') {
        const idBrand = e.params.data.id;
        const nameBrand = e.params.data.text;
        if (idBrand != '') {
          self.tempIdBrand = idBrand;
          self.tempNameBrand = nameBrand;
          self.cs.getSkuFromCustomerAndBrand(self.tempIdCustomer, idBrand).subscribe(skus => {
            self.skuList = skus;
            console.log(skus);
          });
        }
      } else {
        this.openAlert('Scope Alert', 'Escoja un cliente');
      }
    });
    this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
  }
  ngOnDestroy() {
    this.customerSubscription.unsubscribe();
  }
  nuevo() {
    if ($('#cmbCustomer').val() != '') {
      if ($('#cmbBrand').val() != '') {
        this.showEditView();
      } else {
        this.openAlert('Scope Alert!', 'Debe escojer una Marca');
      }
    } else {
      this.openAlert('Scope Alert!', 'Debe escojer un Cliente');
    }
  }
  onSubmit(myForm: NgForm) {
    if (!this.editState) {
      this.sku.estado = 'A';
      this.sku.cliente = this.tempIdCustomer;
      this.sku.marca = this.tempIdBrand;
      this.cs.addSku(this.sku);
    } else {
      this.cs.updSku(this.sku);
      this.editState = false;
    }
    this.clearObject();
    this.salir();
  }
  salir() {
    this.closeEditView();
  }
  edit(sku: ISku) {
    this.editState = true;
    this.showEditView();
    this.sku = Object.assign({}, sku);
  }
  delete(sku: ISku) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar el SKU ' + sku.sku + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        sku.estado = 'I';
        // this.cs.updSku(sku); // Cambia estado a I
        this.cs.delSku(sku); // Elimina permanentemente de la base
      }
    });
  }
  showEditView() {
    if (!this.editState) {
      this.actionName = 'Nuevo';
    } else {
      this.actionName = 'Editar';
    }
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  closeEditView() {
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  clearObject() {
    this.editState = false;
    this.sku = {
      cliente: '',
      marca: '',
      sku: '',
      descripcion: '',
      presentacion: '',
      sabor: '',
      estado: ''
    };
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '250px',
      data: { title: tit , msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
