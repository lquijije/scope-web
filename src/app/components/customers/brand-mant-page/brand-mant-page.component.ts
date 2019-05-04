import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICustomer } from '../../../models/customers/customers';
import { IBrand } from '../../../models/customers/brands';
import { CustomerService } from '../../../services/customer.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-brand-mant-page',
  templateUrl: './brand-mant-page.component.html',
  styleUrls: ['./brand-mant-page.component.css']
})
export class BrandMantPageComponent implements OnInit, OnDestroy {
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
  actionName: string = '';
  customerSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private cs: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    const self = this;
    const n1 = new Option('', '', true, true);
    $('#cmbCustomer').append(n1).trigger('change');
    $('#cmbCustomer').select2({
      placeholder: 'Seleccione...',
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
        self.spinnerService.show();
        self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
          self.spinnerService.hide();
          self.brandList = brands;
        });
      }
    });
    this.spinnerService.show();
    this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
      this.spinnerService.hide();
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
  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      if (this.brand.nombre.trim() === '') {
        this.openAlert('Scope Error', 'Nombre no puede estar vacío');
        return;
      }
      if (!this.editState) {
        this.brand.estado = 'A';
        this.brand.cliente = this.tempIdCustomer;
        this.spinnerService.show();
        this.cs.addBrand(this.brand).then(() => {
          this.spinnerService.hide();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
        });
      } else {
        this.spinnerService.show();
        this.cs.updBrand(this.brand).then(() => {
          this.spinnerService.hide();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
        });;
        this.editState = false;
      }
      this.clearObject();
      this.salir();
    } else {
      this.openAlert('Scope Error', 'Aún faltan campos requeridos.');
    }
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
        this.spinnerService.show();
        this.cs.delBrand(brand).then(() => { // Elimina permanentemente de la base
          this.spinnerService.hide();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
        }); 
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
      width: '25%',
      data: { title: tit , msg: msg }
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
