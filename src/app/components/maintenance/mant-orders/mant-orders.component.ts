import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Subscription } from "rxjs";
import { WorkOrdersService } from "../../../services/work-orders.service";
declare var $: any;

@Component({
  selector: 'app-mant-orders',
  templateUrl: './mant-orders.component.html',
  styleUrls: ['./mant-orders.component.css']
})
export class MantOrdersComponent implements OnInit {
  orderSubscription: Subscription;
  sourceList: any;
  orderList: any;
  hasOrdered: boolean = false;
  constructor(public dialog: MatDialog,
              private spinnerService: Ng4LoadingSpinnerService,
              private ow: WorkOrdersService) { }

  ngOnInit() {
    $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
    $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
        this.orderSubscription.unsubscribe();
    }
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

  get() {
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
        this.sourceList = orders;
        this.orderList = this.sourceList.sort((a, b) => {
            this.hasOrdered = true;
            return a.creacion < b.creacion ? 1 : -1;
        });
    });
  }

  delete() {
    if(this.orderList) {
      let opcion = "";
      let desde = $("#fedesde").val();
      let hasta = $("#fehasta").val();
      if ($("#rd-crea").is(":checked")) {
        opcion = "creacion";
      }
      if ($("#rd-vis").is(":checked")) {
          opcion = "visita";
      }
      this.downloadObjectAsJson(this.orderList, "work-orders_"+opcion+"_"+desde+"_"+hasta);
    }
  }

  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
