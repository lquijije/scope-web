import { Component, OnInit } from '@angular/core';
import { ICustomer } from '../../../models/customers/customers';
import { CustomerService } from '../../../services/customer.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-customer-mant-page',
  templateUrl: './customer-mant-page.component.html',
  styleUrls: ['./customer-mant-page.component.css']
})
export class CustomerMantPageComponent implements OnInit {
  customerList: any;
  customer: ICustomer = {
    ruc: '',
    razonsocial: '',
    direccion: '',
    telefono: '',
    estado: ''
  };
  editState: any = false;
  actionName: string = '';
  constructor(public dialog: MatDialog,
    private sc: CustomerService) { }

  ngOnInit() {
    this.sc.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(cus => cus.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
  }
  nuevo() {
    this.showEditView();
  }

  salir() {
    this.clearObject();
    this.closeEditView();
  }
  onSubmit(myForm: NgForm) {
    if (!this.editState) {
      this.customer.estado = 'A';
      this.sc.addCustomer(this.customer);
    } else {
      this.sc.updCustomer(this.customer);
      this.editState = false;
    }
    this.clearObject();
    this.salir();
  }
  edit(customer: ICustomer) {
    this.editState = true;
    this.showEditView();
    this.customer = Object.assign({}, customer);
  }
  delete(customer: ICustomer) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar el cliente ' + customer.razonsocial + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        customer.estado = 'I';
        // this.sc.updCustomer(v); // Cambia estado a I
        this.sc.delCustomer(customer); // Elimina permanentemente de la base
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
    this.customer = {
      ruc: '',
      razonsocial: '',
      direccion: '',
      telefono: '',
      estado: 'A'
    };
  }
}
