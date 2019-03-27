import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkOrdersService } from '../../../services/work-orders.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { IWorkOrder } from 'src/app/models/work-orders/work-order';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-order-inquiry-page',
  templateUrl: './order-inquiry-page.component.html',
  styleUrls: ['./order-inquiry-page.component.css']
})
export class OrderInquiryPageComponent implements OnInit, OnDestroy {
  orderList: any;
  orderSubscription: Subscription;
  constructor(public dialog: MatDialog,
    private ow: WorkOrdersService) { }

  ngOnInit() {
    this.orderSubscription = this.ow.getWorkOrdersList().subscribe(orders => {
      this.orderList = orders;
      console.log(this.orderList);
    });
  }
  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
  }
}
