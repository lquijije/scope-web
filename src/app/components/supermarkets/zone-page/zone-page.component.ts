import { Component, OnInit, OnDestroy } from '@angular/core';
import { IZone } from '../../../models/supermarkets/zone';
import { SupermaketsService } from '../../../services/supermakets.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
// import * as $ from 'jquery';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-zone-page',
  templateUrl: './zone-page.component.html',
  styleUrls: ['./zone-page.component.css']
})
export class ZonePageComponent implements OnInit, OnDestroy {
  zoneList: any;
  zone: IZone = {
    nombre: ''
  };
  editState: any = false;
  actionName: string = '';
  private paramsSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private sc: SupermaketsService) {
    }
    ngOnInit() {
      // console.log(this.sc.getZone().subscribe());
      this.paramsSubscription = this.sc.getZone().subscribe(zones => {
        this.zoneList = zones
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
      if (!this.editState) {
        this.sc.addZone(this.zone);
      } else {
        this.sc.updZone(this.zone);
        this.editState = false;
      }
      this.clearObject();
      this.salir();
    }
    edit(chain: IZone) {
      this.editState = true;
      this.showEditView();
      this.zone = Object.assign({}, chain);
    }
    delete(zone: IZone) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: { title: 'Confirmación', msg: 'Desea eliminar la zona ' + zone.nombre + '?' }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // this.sc.updZone(zone); // Cambia estado a I
          this.sc.delZone(zone); // Elimina permanentemente de la base
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
      this.zone = {
        nombre: '',
      };
    }
}
