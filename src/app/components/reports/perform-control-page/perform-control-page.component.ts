import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Subscription } from "rxjs";
import { WorkOrdersService } from "../../../services/work-orders.service";
import { IUser } from 'src/app/models/users/user';
import { UsersService } from '../../../services/users.service';
import { ExcelService } from "../../../services/excel.service";

declare var $: any;

@Component({ selector: 'app-perform-control-page', templateUrl: './perform-control-page.component.html', styleUrls: ['./perform-control-page.component.css'] })
export class PerformControlPageComponent implements OnInit {
    desde: string = "";
    hasta: string = "";
    merchantObj: IUser;
    orderSubscription: Subscription;
    merchantSubscription: Subscription;
    merchantList: any;
    orderList: any;
    constructor(public dialog: MatDialog,
        private spinnerService: Ng4LoadingSpinnerService,
        private ow: WorkOrdersService,
        private us: UsersService,
        private excelService: ExcelService) { }

    ngOnInit() {
        const self = this;
        $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $('#cmbMerchant').append(new Option('', '', true, true)).trigger('change');
        $("#cmbMerchant").select2({
            placeholder: "Seleccione Mercaderista",
            language: {
                noResults: function () {
                    return "";
                }
            }
        });
        $('#cmbMerchant').on('select2:select', function (e) {
            const idMerchant = e.params.data.id;
            const nameMerchant = e.params.data.text;
            if (idMerchant !== '') {
                self.merchantObj = {
                    id: idMerchant,
                    nombre: nameMerchant
                };
            }
        });
        this.spinnerService.show();
        this.merchantSubscription = this.us.getMerchants().subscribe(merchants => {
            this.spinnerService.hide();
            this.merchantList = merchants.sort((a, b) => {
                return a.nombre < b.nombre ? -1 : 1;
            });
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
    processReport() {
        let opcion = "";
        if (!$("#fedesde").val() && !$("#fehasta").val()) {
            this.openAlert("Scope Alert", "Debe escoger una fecha de filtro");
            return false;
        }
        let merchant = null
        if(this.merchantObj) {
            merchant = {
                id: this.merchantObj.id.trim(),
                nombre: this.merchantObj.nombre.trim()
            };
        }
        opcion = "visita";
        let desde = $("#fedesde").val();
        let hasta = $("#fehasta").val();
        console.log(merchant);
        this.spinnerService.show();
        this.orderSubscription = this.ow.getWorkOrdersListByMerchant(desde, hasta, opcion, merchant).subscribe(orders => {
            this.spinnerService.hide();
            
            if (this.orderSubscription) {
                this.orderSubscription.unsubscribe();
            }
            let exportJson = [];
            this.orderList = orders;
            if (this.orderList.length > 0) {
                this.orderList.forEach(o => {
                    var breakItem = false;
                    o.sku.forEach(d => {
                        var final = isNaN(parseInt(d.final, 10)) ? -1 : parseInt(d.final, 10);
                        if (final == 0) {
                            breakItem = true;
                            return;
                        }
                    });
                    
                    if (o.iniciada != '' && o.finalizada != '') {
                        var diff = new Date(o.iniciada).getTime() - new Date(o.finalizada).getTime(); 
                        var diffInSeconds = Math.abs(diff) / 1000;
                        var hours = Math.floor(diffInSeconds / 60 / 60 % 24);
                        var minutes = Math.floor((diffInSeconds - (hours * 3600)) / 60 % 60);
                    }
                    console.log((o.iniciada && o.finalizada));
                    exportJson.push({
                        Fecha_Visita: o.visita,
                        Orden: o.numero,
                        Mercaderista: o.mercaderista.nombre,
                        Cliente: o.cliente.razonsocial,
                        Estado: o.estado.nombre,
                        Cadena: o.cadena.nombre,
                        Local: o.local.nombre,
                        Apertura_de_Orden: o.iniciada,
                        Cierre_de_Orden: o.finalizada,
                        Tiempo_Trabajo: (o.iniciada && o.finalizada)?`${hours} horas, ${minutes} minutos`:'',
                        Fotos: ((o.fotos)? o.fotos.length: 0),
                        Quiebre: (breakItem? 'SI': 'NO')
                    });
                    
                });
                this.excelService.exportAsExcelFile(exportJson, "Control_Visitas_Ordenes");
            }
        });
    }
}
