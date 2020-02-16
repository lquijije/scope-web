import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Subscription } from "rxjs";
import { WorkOrdersService } from "../../../services/work-orders.service";

declare var $: any;

@Component({ selector: 'app-visit-report-page', templateUrl: './visit-report-page.component.html', styleUrls: ['./visit-report-page.component.css'] })
export class VisitReportPageComponent implements OnInit {
    desde: string = "";
    hasta: string = "";
    orderSubscription: Subscription;
    constructor(public dialog: MatDialog,
        private spinnerService: Ng4LoadingSpinnerService,
        private ow: WorkOrdersService) { }

    ngOnInit() {
        $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
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
        if ($("#rd-crea").is(":checked")) {
            opcion = "creacion";
        }
        if ($("#rd-vis").is(":checked")) {
            opcion = "visita";
        }
        let desde = $("#fedesde").val();
        let hasta = $("#fehasta").val();
        this.spinnerService.show();
        this.orderSubscription = this.ow.getWorkOrdersList(desde, hasta, opcion).subscribe(orders => {
            this.spinnerService.hide();
            console.info(orders);
            if (this.orderSubscription) {
                this.orderSubscription.unsubscribe();
            }
        });
    }
}
