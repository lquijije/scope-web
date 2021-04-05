import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { CustomerService } from '../../../services/customer.service';
import { ExcelService } from "../../../services/excel.service";
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";

declare var $: any;

@Component({
  selector: 'app-new-vs-blocked',
  templateUrl: './new-vs-blocked.component.html',
  styleUrls: ['./new-vs-blocked.component.css']
})
export class NewVsBlockedComponent implements OnInit {

  constructor(private spinnerService: Ng4LoadingSpinnerService
    ,private cs: CustomerService
    ,private excelService: ExcelService
    ,public dialog: MatDialog) { }
  customerList: any;
  logList: any;
  customerSubscription: Subscription;
  logSubscription: Subscription;
  tempIdCustomer: string = '';
  tempNameCustomer: string = '';
  desde: string = "";
  hasta: string = "";
  ngOnInit() {
    $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
    $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
    $('#cmbCustomer').append(new Option('', '', true, true)).trigger('change');
    $('#cmbCustomer').select2({
        placeholder: 'Seleccione...',
        language: {
            'noResults': function () {
                return '';
            }
        }
    });
    const self = this;
    $('#cmbCustomer').on('select2:select', function (e) {
      const idCustomer = e.params.data.id;
      const nameCustomer = e.params.data.text;
      if (idCustomer != '') {
          self.tempIdCustomer = idCustomer;
          self.tempNameCustomer = nameCustomer;
      }
  });
    this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
      this.spinnerService.hide();
      this.customerList = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
      });
    });
  }
  processReport() {
    if (!$("#fedesde").val() && !$("#fehasta").val()) {
        this.openAlert("Scope Alert", "Debe escoger una fecha de filtro");
        return false;
    }
    let cliente = null;
    let desde = $("#fedesde").val();
    let hasta = $("#fehasta").val();
    let nombreArchivo = 'Ingresados vs Bloqueados.xlsx';
    if (this.tempIdCustomer != '' && this.tempNameCustomer != '') {
        cliente = {
            'id': this.tempIdCustomer,
            'razonsocial': this.tempNameCustomer.trim()
        }
        nombreArchivo = 'Ingresados vs Bloqueados ' + this.tempNameCustomer ;
    }
    this.logSubscription = this.cs.getAssocLogByCustomer(desde, hasta, cliente).subscribe(logs => {
      let exportJson = [];
      
      this.logList = logs.sort((a, b) => {
        return a.fecha < b.fecha ? -1 : 1;
      });
      if (this.logList.length > 0) {
        this.logList.forEach(log => {
          exportJson.push({
            Fecha: log.fecha,
            Actividad: log.accion,
            Cadena: log.cadena.nombre,
            Local: log.local.nombre,
            Producto: log.sku.descripcion,
            Presentacion: log.sku.presentacion,
            Sabor: log.sku.sabor
          });
        });
        this.excelService.exportAsExcelFile(exportJson, nombreArchivo);
      }
    });
  }

  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: "30%",
        data: {
            title: tit,
            msg: msg
        }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
    });
  }
}
