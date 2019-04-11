import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISuperChain } from '../../../models/supermarkets/super-chain';
import { SupermaketsService } from '../../../services/supermakets.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { Subscription } from 'rxjs';

// import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-super-chain-page',
  templateUrl: './super-chain-page.component.html',
  styleUrls: ['./super-chain-page.component.css']
})
export class SuperChainPageComponent implements OnInit, OnDestroy {
  chainList: any;
  chain: ISuperChain = {
    nombre: '',
    alias: '',
    estado: ''
  };
  editState: any = false;
  actionName: string ='';
  private paramsSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private sc: SupermaketsService) { }

  ngOnInit() {
    this.paramsSubscription = this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
  }
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
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
      if (this.chain.nombre.trim() === '') {
        this.openAlert('Scope Error', 'Campo Nombre de cadena no puede estar vacío');
        return;
      }
      if (this.chain.alias.trim() === '') {
        this.openAlert('Scope Error', 'Alias de la cadena no puede estar vacío');
        return;
      }
      if (!this.editState) {
        this.chain.estado = 'A';
        this.sc.addSuperChain(this.chain);
      } else {
        this.sc.updSuperChain(this.chain);
        this.editState = false;
      }
      this.clearObject();
      this.salir();
    } else {
      this.openAlert('Scope Error', 'Aún faltan campos requeridos');
    }
  }
  edit(chain: ISuperChain) {
    this.editState = true;
    this.showEditView();
    this.chain = Object.assign({}, chain);
  }
  delete(chain: ISuperChain) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar la cadena ' + chain.nombre + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        chain.estado = 'I';
        // this.sc.updSuperChain(chain); // Cambia estado a I
        this.sc.delSuperChain(chain); // Elimina permanentemente de la base
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
    this.chain = {
      nombre: '',
      alias: '',
      estado: 'A'
    };
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '25%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
