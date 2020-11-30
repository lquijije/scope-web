import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { WorkOrdersService } from "../../../services/work-orders.service";
import { ImageServiceService } from "../../../services/image-service.service";
import { Subscription } from "rxjs";
declare var $: any;

@Component({
  selector: 'app-mant-images',
  templateUrl: './mant-images.component.html',
  styleUrls: ['./mant-images.component.css']
})
export class MantImagesComponent implements OnInit {
  orderSubscription: Subscription;
  Fotos: any;
  realData: any = [];
  constructor(public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private ow: WorkOrdersService,
    private ims: ImageServiceService) { }

  ngOnInit() {
      $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
      $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
      this.Fotos =  [];
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
        if(orders) {
          this.realData = orders;
          orders.forEach(ord => {
            if(ord['fotos']) {
              ord['fotos'].forEach(img => {
                img['order'] = ord.numero;
                this.Fotos.push(img);
              });
            }
          });
        }
        if (this.orderSubscription) {
            this.orderSubscription.unsubscribe();
        }
    });
}
  delete(){

  }
  deleteOne(img: any) {
    this.ims.delImage(img.nombre).then(()=>{
      let ordObj = this.realData.filter(x => x.numero == img.order);
      if(ordObj.length){
        ordObj= ordObj[0];

        if(ordObj['fotos']) {
          ordObj['fotos'].forEach(el => {
            if(el.nombre == img.nombre) {
              ordObj['fotos'].splice(ordObj['fotos'].indexOf(el), 1);
            }
          });
        }
        this.ow.updWorkOrder(ordObj).then(() =>{
          this.Fotos.splice(this.Fotos.indexOf(img), 1);
        });
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
