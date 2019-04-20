import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICustomer } from '../../../models/customers/customers';
import { CustomerService } from '../../../services/customer.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-customer-mant-page',
  templateUrl: './customer-mant-page.component.html',
  styleUrls: ['./customer-mant-page.component.css']
})
export class CustomerMantPageComponent implements OnInit, OnDestroy {
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
  customerSubsription: Subscription;
  constructor(public dialog: MatDialog,
    private sc: CustomerService,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.customerSubsription = this.sc.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(cus => cus.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
  }
  ngOnDestroy() {
    this.customerSubsription.unsubscribe();
  }
  nuevo() {
    this.showEditView();
  }

  salir() {
    this.clearObject();
    this.closeEditView();
  }
  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      if (!this.editState) {
        this.customer.estado = 'A';
        this.spinnerService.show();
        this.sc.addCustomer(this.customer).then(() => {
          this.spinnerService.hide();
          this.clearObject();
          this.salir();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
          this.clearObject();
          this.salir();
        });
      } else {
        this.spinnerService.show();
        this.sc.updCustomer(this.customer).then(() => {
          this.spinnerService.hide();
          this.clearObject();
          this.salir();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
          this.clearObject();
          this.salir();
        });
        this.editState = false;
      }
    } else {
      this.openAlert('Scope Error', 'Algunos atributos son requeridos.');
    }
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
        this.spinnerService.show();
        this.sc.delCustomer(customer).then(() => { // Elimina permanentemente de la base
          this.spinnerService.hide();
        }).catch(er => {
          this.spinnerService.hide();
          this.openAlert('Scope Error', er.message);
        }); 
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
  onlyNumber(e) {
    if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '25%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
