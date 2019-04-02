import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkOrdersService } from '../../../services/work-orders.service';
import { MatDialog } from '@angular/material';
import { Subscription, Timestamp } from 'rxjs';
import { IUser } from 'src/app/models/users/user';
import { SupermaketsService } from '../../../services/supermakets.service';
import { CustomerService } from '../../../services/customer.service';
import { UsersService } from '../../../services/users.service';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
// import * as $ from 'jquery';
import { ISuperStore } from 'src/app/models/supermarkets/super-store';
import { ExcelService } from '../../../services/excel.service';
import { IWorkOrder } from 'src/app/models/work-orders/work-order';
import { ISuperChain } from 'src/app/models/supermarkets/super-chain';
import { ISkuOrder } from 'src/app/models/customers/skus';
import { IOrderStatus } from 'src/app/models/work-orders/order-status';
import * as firebase from 'firebase';

declare var $: any;
export interface IChainObj {
  id?: string;
  nombre?: string;
}
export interface IStoreObj {
  id?: string;
  nombre?: string;
}
export interface ICustomerObj {
  id?: string;
  razonsocial?: string;
}
export interface IBrandObj {
  id?: string;
  razojnsocial?: string;
}
@Component({
  selector: 'app-order-inquiry-page',
  templateUrl: './order-inquiry-page.component.html',
  styleUrls: ['./order-inquiry-page.component.css']
})
export class OrderInquiryPageComponent implements OnInit, OnDestroy {
  sourceList: any;
  orderList: any;
  orderSubscription: Subscription;
  chainSubscription: Subscription;
  customerSubscription: Subscription;
  merchantSubscription: Subscription;
  statusSubscription: Subscription;
  chainList: any;
  storeList: any = [];
  customerList: any = [];
  brandList: any = [];
  skuList: any;
  orderCurrent: any;
  merchantObj: IUser;
  merchantList: any;
  statusList: any;
  chainObj: IChainObj;
  customerObj: ICustomerObj;
  storeObj: IStoreObj;
  brandObj: any;
  arrBrands: any[] = [];
  arrStatus: any[] = [];
  desde: string = '';
  hasta: string = '';
  estado: string = '';
  constructor(public dialog: MatDialog,
    private ow: WorkOrdersService,
    private sc: SupermaketsService,
    private cu: CustomerService,
    private us: UsersService,
    private excelService: ExcelService
    ) {
      console.log(this.orderCurrent);
    }

  ngOnInit() {
    this.orderSubscription = this.ow.getWorkOrdersList().subscribe(orders => {
      this.sourceList = orders;
      this.orderList = this.sourceList.sort( (a, b) => {
        return a.creacion > b.creacion ? 1 : -1;
      });
    });
    $('#table_details tr').click(function (e) {
      $('#table_details tbody tr').removeClass('highlight');
      $(this).addClass('highlight');
    });

    $('#fedesde').datetimepicker({
      format: 'Y-m-d',
      lang: 'es',
      timepicker: false,
      closeOnDateSelect: true
    });
    $('#fehasta').datetimepicker({
      format: 'Y-m-d',
      lang: 'es',
      timepicker: false,
      closeOnDateSelect: true
    });
    // $('#table_orders').DataTable();
    const self = this;
    const n0 = new Option('', '', true, true);
    $('#cmbMerchant').append(n0).trigger('change');
    $('#cmbMerchant').select2({
      placeholder: 'Seleccione Mercaderista',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    const n1 = new Option('', '', true, true);
    $('#cmbChain').append(n1).trigger('change');
    $('#cmbChain').select2({
      placeholder: 'Seleccione Cadena',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    const n2 = new Option('', '', true, true);
    $('#cmbCustomer').append(n2).trigger('change');
    $('#cmbCustomer').select2({
      placeholder: 'Seleccione Cliente',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    const n3 = new Option('', '', true, true);
    $('#cmbStore').append(n3).trigger('change');
    $('#cmbStore').select2({
      placeholder: 'Seleccione Local',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    const n4 = new Option('', '', true, true);
    $('#cmbBrand').append(n4).trigger('change');
    $('#cmbBrand').select2({
      placeholder: 'Seleccione Marca',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    $('#cmbMerchant').append(new Option('', '')).trigger('change');
    $('#cmbMerchant').select2({
      placeholder: 'Seleccione Mercaderista',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    $('#cmbStatus').append(new Option('', '')).trigger('change');
    $('#cmbStatus').select2({
      placeholder: 'Seleccione Estado',
      language: {
        'noResults': function () {
          return '';
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
    $('#cmbChain').on('select2:select', function (e) {
      const idChain = e.params.data.id;
      const nameChain = e.params.data.text;
      if (idChain !== '') {
        self.chainObj = {
          id: idChain,
          nombre: nameChain
        };
        self.storeList = [];
        self.sc.getSuperStoreFromChain(self.chainObj.id).subscribe(stores => {
          if (stores) {
            self.storeList = stores as ISuperStore;
          }
        });
      }
    });

    $('#cmbStore').on('select2:select', function (e) {
      const idStore = e.params.data.id;
      const nameStore = e.params.data.text;
      if (idStore !== '') {
        self.storeObj = {
          id: idStore,
          nombre: nameStore
        };
      }
    });
    $('#cmbCustomer').on('select2:select', function (e) {
      const idCustomer = e.params.data.id;
      const nameCustomer = e.params.data.text;
      if (idCustomer !== '') {
        self.customerObj = {
          id: idCustomer,
          razonsocial: nameCustomer
        };
        self.brandList = [];
        self.arrBrands = [];
        self.cu.getBrandFromCustomer(idCustomer).subscribe(brands => {
          if (brands) {
            self.brandList = brands;
          }
        });
      }
    });
    $('#cmbBrand').on('select2:select', function (e) {
      const idBrand = e.params.data.id;
      self.arrBrands.push(idBrand);
    });
    $('#cmbBrand').on('select2:unselect', function (e) {
      const idBrand = e.params.data.id;
      self.arrBrands = self.arrBrands.filter(b => {
        return b !== idBrand;
      });
    });
    $('#cmbStatus').on('select2:select', function (e) {
      const idStatus = e.params.data.id;
      self.arrStatus.push(idStatus);
    });
    $('#cmbStatus').on('select2:unselect', function (e) {
      const idStatus = e.params.data.id;
      self.arrStatus = self.arrStatus.filter(b => {
        return b !== idStatus;
      });
    });
    this.chainSubscription = this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
        .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.customerSubscription = this.cu.getCustomer().subscribe(customers => {
      if (customers) {
        this.customerList = customers;
      }
    });
    this.merchantSubscription = this.us.getMerchants().subscribe(merchants => {
      this.merchantList = merchants
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.statusSubscription = this.ow.getOrderStatus().subscribe(status => {
      if (status) {
        this.statusList = status;
      }
    });
  }
  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
    this.chainSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.merchantSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }
  limpiar() {
    this.storeList = [];
    this.brandList = [];
    this.arrBrands = [];
    this.arrStatus = [];
//    this.statusList = [];
    this.desde = '';
    this.hasta = '';
    $('#cmbChain').val('').trigger('change');
    $('#cmbCustomer').val('').trigger('change');
    $('#cmbMerchant').val('').trigger('change');
    $('#cmbStatus').val('').trigger('change');
  }
  consultar() {
    this.orderList = this.sourceList;
    if ($('#rd-crea').is(':checked')) {
      if ($('#fedesde').val() && $('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return e.creacion.toDate().getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime()
            && e.creacion.toDate().getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
      if ($('#fedesde').val() && !$('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return e.creacion.toDate().getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime();
        });
      }
      if (!$('#fedesde').val() && $('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return e.creacion.toDate().getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
    }
    if ($('#rd-vis').is(':checked')) {
      if ($('#fedesde').val() && $('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return new Date(e.visita).getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime()
            && new Date(e.visita).getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
      if ($('#fedesde').val() && !$('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return new Date(e.visita).getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime();
        });
      }
      if (!$('#fedesde').val() && $('#fehasta').val()) {
        this.orderList = this.orderList.filter(e => {
          return new Date(e.visita).getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
    }
    if ($('#cmbMerchant').val() !== '') {
      this.orderList = this.orderList.filter(e => {
        return e.mercaderista.id === this.merchantObj.id;
      });
    }
    if ($('#cmbChain').val() !== '') {
      this.orderList = this.orderList.filter(e => {
        return e.cadena.id === this.chainObj.id;
      });
    }
    if ($('#cmbStore').val() !== '') {
      this.orderList = this.orderList.filter(e => {
        return e.local.id === this.storeObj.id;
      });
    }
    if ($('#cmbCustomer').val() !== '') {
      this.orderList = this.orderList.filter(e => {
        return e.sku.find(s => {
          return s.cliente === this.customerObj.id;
        });
      });
    }
    if (this.arrBrands.length > 0) {
      this.orderList = this.orderList.filter(e => {
        return e.sku.find(s => {
          return s.marca.includes(this.arrBrands);
        });
      });
    }
    if (this.arrStatus.length > 0) {
      this.orderList = this.orderList.filter(e => {
        return this.arrStatus.includes(e.estado.id);
      });
    }
  }
  delete(order: any) {
    if (order.estado.nombre !== 'CREADA') {
      this.openAlert('Scope Alert', 'Sólo se pueden eliminar ordenes CREADAS, la orden seleccionada está en estado ' + order.estado.nombre);
      return false;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar LA ORDEN ' + order.numero + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ow.delOrder(order); // Elimina permanentemente de la base
      }
    });
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  search(order: any) {
    this.orderCurrent = order;
    this.estado = order.estado.nombre;
    $('#hTit').html('Orden #' + order.numero);
    $('#lbEst').text(order.estado.nombre);
    $('#lbCad').text(order.cadena.nombre);
    $('#lbLoc').text(order.local.nombre);
    $('#lbMer').text(order.mercaderista.nombre);
    $('#lbVis').text(order.visita);
    $('#lbCrea').text(order.creacion.toDate().toLocaleString());
    this.skuList = order.sku;
    this.showEditView();
  }
  salir() {
    this.closeEditView();
  }
  showEditView() {
    $('#pnlDetail').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  closeEditView() {
    $('#pnlDetail').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  exportAsXLSX(): void {
    let exportJson = [];
    this.orderList.forEach(o => {
      o.sku.forEach(d => {
        exportJson.push({
          'Orden#': o.numero,
          'Fecha': o.visita,
          'Supermercado': o.cadena.nombre,
          'Local': o.local.nombre,
          'Producto': d.descripcion,
          'Presentación': d.presentacion,
          'Sabor': d.sabor,
          'Cant.Inicial': (isNaN(parseInt(d.inicial, 10))) ? '' : parseInt(d.inicial, 10),
          'Cant.Final': (isNaN(parseInt(d.final, 10))) ? '' : parseInt(d.final, 10),
          'Caras': (isNaN(parseInt(d.caras, 10))) ? '' : parseInt(d.caras, 10),
          'Observaciones': d.observacion,
          'Mercaderista': o.mercaderista.nombre,
          'Competencia': '',
          'Actividad': '',
        });
      });
    });
    this.excelService.exportAsExcelFile(exportJson, 'ordenes');
  }
}
