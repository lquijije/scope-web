import { Component, OnInit } from '@angular/core';
import { ISuperChain } from '../../../models/supermarkets/super-chain';
import { SupermaketsService } from '../../../services/supermakets.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import * as $ from 'jquery';
import { ISuperStore } from 'src/app/models/supermarkets/super-store';
declare var $: any;

@Component({
  selector: 'app-super-store-page',
  templateUrl: './super-store-page.component.html',
  styleUrls: ['./super-store-page.component.css']
})
export class SuperStorePageComponent implements OnInit {
  chainList: any;
  cityList: any;
  zoneList: any;
  store: ISuperStore = {
    cadena: '', 
    ciudad: '',
    direccion: '',
    estado: 'A',
    nombre: '',    
    telefono: '',
    tipo: '',
    zona: ''
  };
  storeList: any;
  empty: ISuperChain[] = [{
    id: '0',
    nombre: '',
    estado: ''
  }]; 
  editState: any = false;
  tempIdChain:string = '';
  tempNameChain: string = '';
  actionName: string = '';
  constructor(public dialog: MatDialog,
    private sc: SupermaketsService,
    private ge: GeneralService) { }

  ngOnInit() {
    var self = this;
    var n1 = new Option('', '', true, true);
    $('#cmbChain').append(n1).trigger('change');
    $('#cmbChain').select2({
      placeholder: "Seleccione...",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
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
    this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.ge.getCity().subscribe(cities => {
      this.cityList = cities
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.ge.getZone().subscribe(zones => {
      this.zoneList = zones
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
  }
  onSubmit(myForm: NgForm) {
    this.store.ciudad = $('#cmbCity').select2('data')[0].text;
    this.store.zona  = $('#cmbZone').select2('data')[0].text;
    if (!this.editState) {
      this.store.estado = 'A';
      this.store.cadena = this.tempIdChain;
      this.sc.addSuperStore(this.store);
    } else {
      this.sc.updSuperStore(this.store);
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
    if($('#cmbChain').val()!=''){
      this.showEditView();
    }else{
      this.openAlert('Scope Alert!', 'Debe escojer una cadena de Supermercado');
    }
  }
  edit(store: ISuperStore){
    this.editState = true;
    this.showEditView();
    this.selectCityByStore(store);
    this.selectZoneByStore(store);
    this.store = Object.assign({}, store);
  }
  delete(store: ISuperStore){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar el local ' + store.nombre + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        store.estado = 'I';
        // this.sc.updSuperStore(store); // Cambia estado a I
        this.sc.delSuperStore(store); // Elimina permanentemente de la base
      }
    });
  }
  showEditView() {
    if(!this.editState){
      this.actionName = 'Nuevo';
    }else{
      this.actionName = 'Editar';
    }
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
    var n2 = new Option('', '', true, true);
    $('#cmbCity').append(n2).trigger('change');
    $('#cmbCity').select2({
      placeholder: "Ciudad",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
    var n3 = new Option('', '', true, true);
    $('#cmbZone').append(n2).trigger('change');
    $('#cmbZone').select2({
      placeholder: "Zona",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
  }
  selectCityByStore(store: ISuperStore){
    $("#cmbCity").val($("#cmbCity option:contains('"+store.ciudad+"')").val()).trigger('change');
  }
  selectZoneByStore(store: ISuperStore){
    $("#cmbZone").val($("#cmbZone option:contains('"+store.zona+"')").val()).trigger('change');
  }
  closeEditView() {
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  clearObject() {
    this.editState = false;
    this.store = {
      cadena: '', 
      ciudad: '',
      direccion: '',
      estado: 'A',
      nombre: '',    
      telefono: '',
      tipo: '',
      zona: ''
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
