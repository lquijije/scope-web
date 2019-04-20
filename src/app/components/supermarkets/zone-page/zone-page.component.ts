import { Component, OnInit, OnDestroy } from '@angular/core';
import { IZone } from '../../../models/supermarkets/zone';
import { SupermaketsService } from '../../../services/supermakets.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
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
    private sc: SupermaketsService,
    private spinnerService: Ng4LoadingSpinnerService) {
    }
    ngOnInit() {
      // console.log(this.sc.getZone().subscribe());
      this.spinnerService.show();
      this.paramsSubscription = this.sc.getZone().subscribe(zones => {
        this.spinnerService.hide();
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
      if (myForm.valid) {
        if (this.zone.nombre.trim() === '') {
          this.openAlert('Scope Error', 'Campo Nombre de zona no puede estar vacío');
          return;
        }
        if (!this.editState) {
          this.spinnerService.show();
          this.sc.addZone(this.zone).then(() => {
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
          this.sc.updZone(this.zone).then(() => {
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
        this.openAlert('Scope Error', 'Aún faltan campos requeridos');
      }
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
          this.sc.delZone(zone).then(() => { // Elimina permanentemente de la base
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
      this.zone = {
        nombre: '',
      };
    }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '20%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
}
