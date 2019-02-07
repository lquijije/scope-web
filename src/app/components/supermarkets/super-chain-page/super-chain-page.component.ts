import { Component, OnInit } from '@angular/core';
import { ISuperChain } from '../../../models/supermarkets/super-chain';
import { SupermaketsService } from '../../../services/supermakets.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';

import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-super-chain-page',
  templateUrl: './super-chain-page.component.html',
  styleUrls: ['./super-chain-page.component.css']
})
export class SuperChainPageComponent implements OnInit {
  chainList: any;
  chain: ISuperChain = {
    nombre: '',
    alias: '',
    estado: ''
  };
  editState: any = false;
  actionName: string ='';
  constructor(public dialog: MatDialog,
    private sc: SupermaketsService) { }

  ngOnInit() {
    this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
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
      this.chain.estado = 'A';
      this.sc.addSuperChain(this.chain);
    } else {
      this.sc.updSuperChain(this.chain);
      this.editState = false;
    }
    this.clearObject();
    this.salir();
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
}
