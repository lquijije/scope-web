import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../../../models/customers/customers';
import { IBrand } from '../../../models/customers/brands';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-brand-mant-page',
  templateUrl: './brand-mant-page.component.html',
  styleUrls: ['./brand-mant-page.component.css']
})
export class BrandMantPageComponent implements OnInit {
  customerList: any;
  brand: IBrand = {
    nombre: '', 
    cliente: '',
    estado: 'A'
  };
  brandList: any;
  editState: any = false;
  tempIdCustomer: string = '';
  tempNameCustomer: string = '';
  actionName:string ='';
  constructor(public dialog: MatDialog,
    private cs: CustomerService) { }

  ngOnInit() {
    var self = this;
    var n1 = new Option('', '', true, true);
    $('#cmbCustomer').append(n1).trigger('change');
    $('#cmbCustomer').select2({
      placeholder: "Seleccione...",
      language: {
          "noResults": function () {
              return "";
          }
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
          console.log(self.brandList);
        });
      }
    });
    this.cs.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
  }
  onSubmit(myForm: NgForm) {
    if (!this.editState) {
      this.brand.estado = 'A';
      this.brand.cliente = this.tempIdCustomer;
      this.cs.addBrand(this.brand);
    } else {
      this.cs.updBrand(this.brand);
      this.editState = false;
    }
    this.clearObject();
    this.salir();
  }
  salir(){
    this.clearObject();
    this.closeEditView();
  }
  nuevo(){
    if($('#cmbCustomer').val()!=''){
      this.showEditView();
    }else{
      this.openAlert('Scope Alert!', 'Debe escojer un Cliente');
    }
  }
  edit(brand: IBrand){
    this.editState = true;
    this.showEditView();
    this.brand = Object.assign({}, brand);
  }
  delete(brand: IBrand){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar la marca ' + brand.nombre + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        brand.estado = 'I';
        //this.cs.updBrand(brand); // Cambia estado a I
        this.cs.delBrand(brand); // Elimina permanentemente de la base
      }
    });
  }
  showEditView() {
    if(!this.editState){
      this.actionName = 'Nueva';
    }else{
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
    this.brand = {
      estado: 'A',
      nombre: '',    
      cliente: ''
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
