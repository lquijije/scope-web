import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkOrdersService } from '../../../services/work-orders.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/models/users/user';
import { SupermaketsService } from '../../../services/supermakets.service';
import { CustomerService } from '../../../services/customer.service';
import { UsersService } from '../../../services/users.service';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ISuperStore } from 'src/app/models/supermarkets/super-store';
import { ExcelService } from '../../../services/excel.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { GeneralService } from '../../../services/general.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

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
  imagesOrderList: any;
  orderSubscription: Subscription;
  chainSubscription: Subscription;
  customerSubscription: Subscription;
  merchantSubscription: Subscription;
  statusSubscription: Subscription;
  prioritySubscription: Subscription;
  chainList: any;
  storeList: any = [];
  customerList: any = [];
  brandList: any = [];
  skuList: any;
  orderCurrent: any;
  merchantObj: IUser;
  merchantList: any;
  priorityList: any;
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
  hasOrdered: boolean = false;
  constructor(public dialog: MatDialog,
    private ow: WorkOrdersService,
    private sc: SupermaketsService,
    private cu: CustomerService,
    private us: UsersService,
    private excelService: ExcelService,
    private spinnerService: Ng4LoadingSpinnerService,
    private afStorage: AngularFireStorage,
    private gs: GeneralService
    ) {
      console.log(this.orderCurrent);
    }

  ngOnInit() {
    this.spinnerService.show();
    this.orderSubscription = this.ow.getWorkOrdersList().subscribe(orders => {
      this.spinnerService.hide();
      this.sourceList = orders;
      if (!this.orderCurrent) {
        this.orderCurrent = {
          cadena: {id: "Bs1mZF3XIvOb9TCwBha7", nombre: "MI COMISARIATO"},
          creacion: "",
          estado: {id: "eNyPUyFqo8SrwkKvDAgD", nombre: "CREADA"},
          id: "lfBAc8aZ9rh17SRcTwLu",
          local: {id: "nwdBVaEJ3CtySCcVTsgx", nombre: "CALIFORNIA"},
          mercaderista: {id: "gMoj90f5n0DUhcasU1fY", nombre: "Luis Quijije P."},
          numero: "00001",
          prioridad: "NORMAL",
          sku: [{
            cliente: "d1IUeEnOmfEgwsLVALLa",
            descripcion: "ARROZ HOME DELIVERERS",
            ds_cliente: "BANAPOV",
            ds_marca: "ARROZ HOME DELIVERERS",
            estado: "A",
            id: "9vrUVbdpoeHLB8A4LvBj",
            marca: "CfS1fkkDEAZu6wAOqh8y",
            presentacion: "5 KG",
            sabor: "",
            sku: "40010211",
          }],
          visita: "2019-05-27 09:00"
        } 
      } else {
        const curOrNum = this.orderCurrent.numero;
        this.orderCurrent = this.sourceList.filter(o => {
          return o.numero == curOrNum;
        })[0];
        this.skuList = this.orderCurrent.sku;
        this.estado = this.orderCurrent.estado.nombre;
      }
      //if (!this.hasOrdered) {  
        this.orderList = this.sourceList.sort( (a, b) => {
          this.hasOrdered = true;
          return a.creacion < b.creacion ? 1 : -1;
        });
      //}
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
    $('#cmbMerchantOrder').select2({
      placeholder: 'Seleccione Mercaderista',
      language: {
        'noResults': function () {
          return '';
        }
      }
    });
    $('#cmbPriority').select2({
      placeholder: 'Seleccione Prioridad',
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
        self.spinnerService.show();
        self.sc.getSuperStoreFromChain(self.chainObj.id).subscribe(stores => {
          self.spinnerService.hide();
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
        self.spinnerService.show();
        self.cu.getBrandFromCustomer(idCustomer).subscribe(brands => {
          self.spinnerService.hide();
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
    self.spinnerService.show();
    this.chainSubscription = this.sc.getSuperChain().subscribe(chains => {
      self.spinnerService.hide();
      this.chainList = chains
        .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.customerSubscription = this.cu.getCustomer().subscribe(customers => {
      self.spinnerService.hide();
      if (customers) {
        this.customerList = customers;
      }
    });
    this.merchantSubscription = this.us.getMerchants().subscribe(merchants => {
      self.spinnerService.hide();
      this.merchantList = merchants
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.statusSubscription = this.ow.getOrderStatus().subscribe(status => {
      self.spinnerService.hide();
      if (status) {
        this.statusList = status;
      }
    });
    this.prioritySubscription = this.gs.getPriority().subscribe(priorities => {
      this.spinnerService.hide();
      this.priorityList = priorities
        .sort((a, b) => {
          return a.nombre > b.nombre ? -1 : 1;
        });
    });
  }
  ngOnDestroy() {
    this.orderSubscription.unsubscribe();
    this.chainSubscription.unsubscribe();
    this.customerSubscription.unsubscribe();
    this.merchantSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
    this.prioritySubscription.unsubscribe();
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
    this.orderList = this.sourceList.sort((a, b) => {
      this.hasOrdered = true;
      return a.creacion < b.creacion ? 1 : -1;
    });
    
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
    if (order.estado.nombre !== 'CREADA' && order.estado.nombre !== 'INICIADA') {
      this.openAlert('Scope Alert', 'Sólo se pueden eliminar ordenes CREADAS o INICIADAS, la orden seleccionada está en estado '
      + order.estado.nombre);
      return false;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea eliminar LA ORDEN ' + order.numero + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinnerService.show();
        this.ow.delOrder(order).then(() => {
          this.spinnerService.hide();
        }).catch(er => {
          this.openAlert('Scope Error', er.message);
          this.spinnerService.hide();
        }); // Elimina permanentemente de la base
      }
    });
  }
  openAlert(tit: string, msg: string): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '30%',
      data: { title: tit, msg: msg }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  search(order: any) {
    this.orderCurrent = Object.assign({}, order);
    this.estado = order.estado.nombre;
    $('#hTit').html('Orden #' + order.numero);
    $('#lbEst').text(order.estado.nombre);
    $('#lbCad').text(order.cadena.nombre);
    $('#lbLoc').text(order.local.nombre);
    $('#lbMer').text(order.mercaderista.nombre);
    $('#lbVis').text(order.visita);
    if (order.novedades) {
      $('#lbNov').text(order.novedades);
    } else {
      $('#lbNov').text('');
    }
    $('#lbCrea').text(order.creacion.toDate().toLocaleString());
    this.skuList = order.sku;
    this.showDetailView();
  }
  images(order: any) {
    this.orderCurrent = Object.assign({}, order);
    $('#hTitImg').html('Fotos de orden #' + order.numero);
    this.showImageView();
  }
  salir() {
    this.closeEditView();
  }
  showDetailView() {
    $('#pnlDetail').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  showEditView() {
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  closeEditView() {
    $('#pnlDetail').addClass('d-none');
    $('#pnlImages').addClass('d-none');
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');
  }
  showImageView() {
    $('#pnlImages').removeClass('d-none');
    $('#pnlList').addClass('d-none');
  }
  exportAsXLSX(): void {
    let exportJson = [];
    if (this.orderList.length > 0) {
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
            'Sugerido': (isNaN(parseInt(d.sugerido, 10))) ? '' : parseInt(d.sugerido, 10),
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
  download(img: any) {
    if (img.url !== '') {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function (e) {
        const blob = xhr.response;
        const localUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = localUrl;
        a.download = img.nombre + '.JPG';
        a.click();
        window.URL.revokeObjectURL(localUrl);
      };
      xhr.open('GET', img.url);
      xhr.send();
    }
  }
  downloadAll() {
    if (this.orderCurrent.fotos.length > 0) {
      const urlFiles = [];
      this.spinnerService.show();
      this.orderCurrent.fotos.forEach(img => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        const order = this.orderCurrent;
        const spinner = this.spinnerService;
        xhr.onload = function (e) {
          const blob = xhr.response;
          const localUrl = window.URL.createObjectURL(blob);
          urlFiles.push({
            name: img.nombre,
            url: localUrl
          });
          if (order.fotos.length === urlFiles.length) {
            const zip = new JSZip();
            let zipElem = 0;
            urlFiles.forEach(file => {
              const ord = order;
              const spin = spinner;
              JSZipUtils.getBinaryContent(file.url, function (err, data) {
                if (err) {
                  throw err;
                }
                zipElem++;
                zip.file(ord.local.nombre + '/' + file.name + '.JPG', data, { binary: true });
                if (zipElem === urlFiles.length) {
                  zip.generateAsync({ type: 'blob' }).then(function (content) {
                    spin.hide();
                    saveAs(content, ord.cadena.nombre + '_' + ord.numero + '.zip');
                  });
                }
              });
              window.URL.revokeObjectURL(file.url);
            });
          }
        };
        xhr.open('GET', img.url);
        xhr.send();
      });
    } else {
      this.openAlert('Scope Alert', ' No existen imágenes ');
    }
  }
  editOrder(order: any) {
    $('#fevisita').datetimepicker({
      format: 'Y-m-d H:i',
      lang: 'es',
      timepicker: true,
      closeOnDateSelect: true
    });
    this.orderCurrent = Object.assign({}, order);
    $('#fevisita').val(this.orderCurrent.visita);
    $('#hTitEdit').html('Editar Orden #' + this.orderCurrent.numero);
    $('#cmbMerchantOrder').val(this.orderCurrent.mercaderista.id).trigger('change');
    $('#cmbPriority').val($('#cmbPriority option:contains(' + this.orderCurrent.prioridad + ')').val()).trigger('change');
    // $('#cmbMerchantOrder').text(this.orderCurrent.mercaderista.nombre);
    this.showEditView();
  }
  exclude(sku: any) {
    const index: number = this.orderCurrent.sku.indexOf(sku);
    if (index !== -1) {
      this.orderCurrent.sku.splice(index, 1);
    }
  }
  onSubmit(formNew: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmación', msg: 'Desea modificar LA ORDEN ' + this.orderCurrent.numero + '?' }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderCurrent.visita = $('#fevisita').val();
        this.orderCurrent.mercaderista = {
          id: $('#cmbMerchantOrder').val(),
          nombre: $('#cmbMerchantOrder').select2('data')[0].text
        };
        this.orderCurrent.prioridad = $('#cmbPriority').select2('data')[0].text;
        this.spinnerService.show();
        this.ow.updWorkOrder(this.orderCurrent).then(() => {
          this.spinnerService.hide();
          this.openAlert('Scope Web', 'Orden fué modificada correctamente.');
          this.salir();
        }).catch(err => {
          this.openAlert('Scope Error', err.message);
        });
      }
    });
  }
  downloadImages() {
    if (!$('#fedesde').val() && !$('#fehasta').val()) {
      this.openAlert('Scope Alert', 'Debe escoger una fecha de filtro');
      return false;
    }
    this.imagesOrderList = this.sourceList;
    if ($('#rd-crea').is(':checked')) {
      if ($('#fedesde').val() && $('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return e.creacion.toDate().getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime()
            && e.creacion.toDate().getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
      if ($('#fedesde').val() && !$('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return e.creacion.toDate().getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime();
        });
      }
      if (!$('#fedesde').val() && $('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return e.creacion.toDate().getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
    }
    if ($('#rd-vis').is(':checked')) {
      if ($('#fedesde').val() && $('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return new Date(e.visita).getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime()
            && new Date(e.visita).getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
      if ($('#fedesde').val() && !$('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return new Date(e.visita).getTime() > new Date($('#fedesde').val() + ' 00:00:000').getTime();
        });
      }
      if (!$('#fedesde').val() && $('#fehasta').val()) {
        this.imagesOrderList = this.imagesOrderList.filter(e => {
          return new Date(e.visita).getTime() < new Date($('#fehasta').val() + ' 23:59:59').getTime();
        });
      }
    }
    if(this.imagesOrderList.length > 0) {
      this.imagesOrderList = this.imagesOrderList.filter(e => {
        return e.fotos;
      });
    }
    if(this.imagesOrderList.length > 0) {
      const imagesArray = [];
      this.imagesOrderList.forEach(orderItem => {
        orderItem.fotos.forEach(img => {
          imagesArray.push({
            numero: orderItem.numero,
            cadena: orderItem.cadena.nombre,
            local: orderItem.local.nombre,
            namePhoto: img.nombre,
            urlPhoto: img.url
          });
        });
      });
      let urlFiles = [];
      const imgAr = imagesArray;
      this.spinnerService.show();
      imagesArray.forEach(item => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        const spinner = this.spinnerService;
        xhr.onload = function (e) {
          const blob = xhr.response;
          let localUrl = '';
          if (blob) {
            if (blob.type.includes('image')) { 
              localUrl = window.URL.createObjectURL(blob);
            } else {
              localUrl = 'assets/images/noimage.jpg';
            }
          } else {
            localUrl = 'assets/images/noimage.jpg';
          }
          urlFiles.push({
            numero: item.numero,
            cadena: item.cadena,
            local: item.local,
            name: item.namePhoto,
            url: localUrl
          });
          if (imgAr.length === urlFiles.length) {
            const zip = new JSZip();
            let zipElem = 0;
            urlFiles.forEach(file => {
              const spin = spinner;
              JSZipUtils.getBinaryContent(file.url, function (err, data) {
                if (err) {
                  console.log(err);
                }
                zipElem++;
                zip.file(file.cadena + '/' + file.local + '/' + file.name + '.JPG', data, { binary: true });
                if (zipElem === urlFiles.length) {
                  zip.generateAsync({ type: 'blob' }).then(function (content) {
                    spin.hide();
                    saveAs(content, 'scope_fotos' + '.zip');
                  });
                }
              }); 
              window.URL.revokeObjectURL(file.url);
            });
          }
        };
        xhr.open('GET', item.urlPhoto);
        xhr.send();
      });
    } else {
      this.openAlert('Scope Alert', 'No encontramos ordenes con fotos en esa fecha');
    }
  }
}
