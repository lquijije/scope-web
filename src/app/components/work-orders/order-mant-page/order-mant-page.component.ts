import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISku } from '../../../models/customers/skus';
import { IOrderStatus } from '../../../models/work-orders/order-status';
import { CustomerService } from '../../../services/customer.service';
import { SupermaketsService } from '../../../services/supermakets.service';
import { UsersService } from '../../../services/users.service';
import { WorkOrdersService } from '../../../services/work-orders.service';
import { GeneralService } from '../../../services/general.service';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { ConfirmDialogComponent } from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../../dialog-components/alert-dialog/alert-dialog.component';
import { IAssociatedBrands } from 'src/app/models/customers/associated-brands';
import { IWorkOrder } from 'src/app/models/work-orders/work-order';
import { of } from 'rxjs';
import { groupBy, mergeMap, reduce, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ICustomer } from 'src/app/models/customers/customers';
import { IUser } from 'src/app/models/users/user';

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
@Component({ selector: 'app-order-mant-page', templateUrl: './order-mant-page.component.html', styleUrls: ['./order-mant-page.component.css'] })

export class OrderMantPageComponent implements OnInit,
    OnDestroy {
    undefined: any;
    chainList: any;
    chainObj: IChainObj;
    storeList: any = [];
    storeObj: IStoreObj;
    customerList: any = [];
    customerObj: ICustomerObj;
    brandList: any = [];
    brandObj: any;
    skuList: any;
    workOrderList: IWorkOrder[] = [];
    merchantList: any;
    merchantObj: IUser;
    priorityList: any;
    priorityObj: any;
    oStatusList: any;
    tempIdChain: string;
    tempNameChain: string;
    tempIdStore: string;
    tempNameStore: string;
    tempIdCustomer: string;
    tempNameCustomer: string;
    tempIdBrand: string;
    tempNameBrand: string;
    editState: any = false;
    actionName: string = '';
    sequential = 1;
    rowSkuList: any;
    superChainSubscription: Subscription;
    merchantSubscription: Subscription;
    prioritySubscription: Subscription;
    workOrderSubscription: Subscription;
    secuentialSubscription: Subscription;
    constructor(public dialog: MatDialog, private cs: CustomerService, private sc: SupermaketsService, private us: UsersService, private ow: WorkOrdersService, private gs: GeneralService, private spinnerService: Ng4LoadingSpinnerService) { }

    ngOnInit() {

        const self = this;
        this.priorityObj = {
            id: 'UwJiKYkri6euQnKzEzy1',
            nombre: 'NORMAL'
        };
        $('#calendar').multiDatesPicker({
            onSelect: function (e) {
                const dates = $('#calendar').multiDatesPicker('getDates');
                let htm = '';
                dates.forEach(d => {
                    htm += `<div class="row">
                    <div class="col d-flex flex-row align-items-center">
                      <small>${d}</small>:
                      <input type="time" class="form-control form-control-sm w-50" style="width=20px;!important" value="09:00" id="${d}"/>
                    </div>
                  </div>`;
                });
                $('#times').html(htm);
            },
            dateFormat: 'yy-mm-dd'
        });
        $('.ui-datepicker').css('font-size', 12);
        $('#txFeVis').datetimepicker({ format: 'Y-m-d', lang: 'es', timepicker: false, closeOnDateSelect: true });
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
        $('#cmbPriority').val('UwJiKYkri6euQnKzEzy1').trigger('change');
        $('#cmbPriority').select2({
            placeholder: 'Seleccione Prioridad',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        $('#cmbPriority').on('select2:select', function (e) {
            const idPriority = e.params.data.id;
            const namePriority = e.params.data.text;
            if (idPriority !== '') {
                self.priorityObj = {
                    id: idPriority,
                    nombre: namePriority
                };
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
                self.tempIdChain = idChain;
                self.tempNameChain = nameChain;
                self.chainObj = {
                    id: idChain,
                    nombre: nameChain
                };
                self.storeList = [];
                self.customerList = [];
                self.brandList = [];
                self.skuList = [];
                self.spinnerService.show();
                self.sc.getSuperStoreFromChainAssociate(self.chainObj).subscribe(associated => {
                    self.spinnerService.hide();
                    if (associated) {
                        (associated as IAssociatedBrands[]).forEach(i => self.storeList.push(i.local));
                        self.storeList = self.removeDuplicates(self.storeList);
                    }
                });
            }
        });
        $('#cmbStore').on('select2:select', function (e) {
            const idStore = e.params.data.id;
            const nameStore = e.params.data.text;
            if (idStore !== '') {
                if (self.chainObj) {
                    self.tempIdStore = idStore;
                    self.tempNameStore = nameStore;
                    self.storeObj = {
                        id: idStore,
                        nombre: nameStore
                    };
                    self.customerList = [];
                    self.brandList = [];
                    self.skuList = [];
                    self.spinnerService.show();
                    self.sc.getCustomersFromChainStoreAssociate(self.chainObj, self.storeObj).subscribe(associated => {
                        self.spinnerService.hide();
                        if (associated) {
                            (associated as IAssociatedBrands[]).forEach(i => self.customerList.push(i.cliente));
                            self.customerList = self.removeDuplicates(self.customerList);
                        }
                    });
                }
            }
        });
        $('#cmbCustomer').on('select2:select', function (e) {
            const idCustomer = e.params.data.id;
            const nameCustomer = e.params.data.text;
            if (idCustomer !== '') {
                if (self.chainObj) {
                    if (self.storeObj) {
                        self.tempIdCustomer = idCustomer;
                        self.tempNameCustomer = nameCustomer;
                        self.customerObj = {
                            id: idCustomer,
                            razonsocial: nameCustomer
                        };
                        self.brandList = [];
                        self.skuList = []; // Comentar para orden multi cliente
                        self.spinnerService.show();
                        self.sc.getBrandsFromChainStoreCustomerAssociate(self.chainObj, self.storeObj, self.customerObj).subscribe(associated => {
                            self.spinnerService.hide();
                            if (associated) {
                                (associated as IAssociatedBrands[]).forEach(i => self.brandList.push(i.marca));
                                self.brandList = self.removeDuplicates(self.brandList);
                            }
                        });
                    }
                }
            }
        });
        $('#cmbBrand').on('select2:select', function (e) {
            if (self.tempIdCustomer !== '') {
                const idBrand = e.params.data.id;
                const nameBrand = e.params.data.text;
                if (idBrand !== '') {
                    if (self.chainObj) {
                        if (self.storeObj) {
                            if (self.customerObj) {
                                self.tempIdBrand = idBrand;
                                self.tempNameBrand = name;
                                self.brandObj = {
                                    id: idBrand,
                                    nombre: nameBrand
                                };
                                self.spinnerService.show();
                                self.sc.getSkusFromChainStoreCustomerBrandAssociate(self.chainObj, self.storeObj, self.customerObj, self.brandObj).subscribe(associated => {
                                    self.spinnerService.hide();
                                    if (associated) {
                                        (associated as IAssociatedBrands[]).forEach(i => {
                                            i.sku = i.sku.sort((a, b) => {
                                                return ((a.orden < b.orden) ? -1 : 0);
                                            });
                                            i.sku.forEach(s => {
                                                s['ds_cliente'] = i.cliente.razonsocial;
                                                s['ds_marca'] = i.marca.nombre;
                                                self.skuList.push(s);
                                            });
                                        });
                                        self.skuList = self.removeDuplicates(self.skuList);
                                        const inter = setInterval(() => {
                                            $('#table_skus tbody tr').click(function (e) {
                                                self.rowSkuList = $(this)[0].sectionRowIndex;
                                                $('#table_skus tbody tr').removeClass("highlight");
                                                $(this).addClass("highlight");
                                            });
                                            clearInterval(inter);
                                        }, 500);
                                    }
                                });
                            }
                        }
                    }
                }
            } else {
                this.openAlert('Scope Alert', 'Escoja un cliente');
            }
        });
        $('#cmbBrand').on('select2:unselect', function (e) {
            const idBrand = e.params.data.id;
            const nameBrand = e.params.data.text;
            self.skuList = self.skuList.filter(item => {
                return item.marca != idBrand;
            });
        });
        this.superChainSubscription = this.sc.getSuperChain().subscribe(chains => {
            this.chainList = chains.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.nombre < b.nombre ? -1 : 1;
            });
        });
        this.spinnerService.show();
        this.merchantSubscription = this.us.getMerchants().subscribe(merchants => {
            this.spinnerService.hide();
            this.merchantList = merchants.sort((a, b) => {
                return a.nombre < b.nombre ? -1 : 1;
            });
        });
        this.prioritySubscription = this.gs.getPriority().subscribe(priorities => {
            this.spinnerService.hide();
            this.priorityList = priorities.sort((a, b) => {
                return a.nombre > b.nombre ? -1 : 1;
            });
        });
        this.secuentialSubscription = this.ow.getWorkOrders().subscribe(d => {
            this.spinnerService.hide();
            if (d.length > 0) { // this.sequential = d.length + 1;
                this.sequential = parseInt(d.reduce(function (a, b) {
                    return (parseInt(a.numero) > parseInt(b.numero)) ? a : b;
                }).numero) + 1;
            }
        });

    }
    ngOnDestroy() {
        this.superChainSubscription.unsubscribe();
        this.merchantSubscription.unsubscribe();
        this.prioritySubscription.unsubscribe();
        // this.workOrderSubscription.unsubscribe();
        this.secuentialSubscription.unsubscribe();
    }
    removeDuplicates(arr) {
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            obj[arr[i]['id']] = arr[i];
        }
        arr = new Array();
        for (const key in obj) {
            if (key) {
                arr.push(obj[key]);
            }
        }
        return arr;
    }
    onSubmit(myForm: NgForm) {

        const dates = $('#calendar').multiDatesPicker('getDates');
        if (dates.length === 0) {
            this.openAlert('Scope Alert!', 'No ha seleccionado una fecha de visita');
            return false;
        }
        if (!this.chainObj) {
            this.openAlert('Scope Alert!', 'No ha seleccionado una cadena de supermercado');
            return false;
        }
        if (!this.merchantObj) {
            this.openAlert('Scope Alert!', 'No ha seleccionado un mercaderista');
            return false;
        }
        if (!this.storeObj) {
            this.openAlert('Scope Alert!', 'No ha seleccionado una tienda de supermercado');
            return false;
        }
        if (!this.customerObj) {
            this.openAlert('Scope Alert!', 'No ha seleccionado un cliente');
            return false;
        }
        if (!this.skuList) {
            this.openAlert('Scope Alert!', 'No ha ingresado productos (sku)');
            return false;
        }
        if (this.skuList.length === 0) {
            this.openAlert('Scope Alert!', 'No ha ingresado productos (sku)');
            return false;
        }

        this.skuList.forEach(sku => {
            sku['orden'] = this.skuList.indexOf(sku) + 1;
        });
        this.merchantObj.nombre = this.merchantObj.nombre.trim();
        dates.forEach(i => {
            this.workOrderList.push({ // numero: this.chainObj.nombre.trim().replace(' ', '').substr(0, 3) + '-' + this.generateUID(),
                numero: ('00000' + this.sequential).slice(-5),
                prioridad: this.priorityObj.nombre,
                cliente: this.customerObj,
                cadena: this.chainObj,
                local: this.storeObj,
                mercaderista: this.merchantObj,
                visita: i + ' ' + $('#' + i).val(),
                creacion: new Date(),
                estado: {
                    id: 'eNyPUyFqo8SrwkKvDAgD',
                    nombre: 'CREADA'
                },
                sku: this.skuList
            });
            this.sequential++;
        });

        let count = 0;
        this.spinnerService.show();
        const inter = setInterval(() => {
            this.workOrderList.forEach(w => {
                this.ow.addWorkOrder(w).then(() => {
                    count++;
                    if (count === this.workOrderList.length) {
                        this.spinnerService.hide();
                        const strOrders = this.workOrderList.map(x => {
                            return x.numero;
                        });
                        this.openAlert('Scope Web', `Se generaron las siguientes órdenes:  ${
                            strOrders.join()
                            }`);
                        this.limpiar();
                    }
                });
                clearInterval(inter);
            });
        }, 500);
        // const inter = setInterval(() => {
        /* this.ow.addWorkOrders(this.workOrderList).then(msg => {
        // this.spinnerService.hide();
        const strOrders = this.workOrderList.map(x => {
          return x.numero;
        });      
        this.openAlert('Scope Web', `Se generaron las siguientes órdenes:  ${strOrders.join()}`);
        this.limpiar();
      }).catch(err => {
        // this.spinnerService.hide();
        this.openAlert('Scope Error', `No se generaron algunas órdenes, ${err.message}`);
      }); */
        // clearInterval(inter);
        // }, 3000);

    }
    calendarizar() { }
    move(array, element, delta) {
        var index = array.indexOf(element);
        var newIndex = index + delta;
        if (newIndex < 0 || newIndex == array.length)
            return;



        // Already at the top or bottom.
        this.rowSkuList = newIndex;
        this.array_move(array, index, newIndex);
    };
    up() {
        if (this.rowSkuList !== undefined) {
            this.move(this.skuList, this.skuList[this.rowSkuList], -1);
        }
    }
    down() {
        if (this.rowSkuList !== undefined) {
            this.move(this.skuList, this.skuList[this.rowSkuList], 1);
        }
    }

    array_move(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        // return arr; // for testing purposes
    };

    limpiar() {
        this.chainObj = this.undefined;
        this.storeObj = this.undefined;
        this.customerObj = this.undefined;
        this.brandObj = this.undefined;
        this.merchantObj = this.undefined;
        $('#cmbMerchant').val('').trigger('change');
        $('#cmbChain').val('').trigger('change');
        this.storeList = [];
        this.customerList = [];
        this.brandList = [];
        this.skuList = [];
        this.workOrderList = [];
        $('#calendar').multiDatesPicker('resetDates');
        $('#times').html('');
        this.priorityObj = {
            id: 'UwJiKYkri6euQnKzEzy1',
            nombre: 'NORMAL'
        };
    }
    exclude(sku: any) {
        const index: number = this.skuList.indexOf(sku);
        if (index !== -1) {
            this.skuList.splice(index, 1);
        }
    }
    openAlert(tit: string, msg: string): void {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: '25%',
            data: {
                title: tit,
                msg: msg
            }
        });

        dialogRef.afterClosed().subscribe((result) => { });
    }
    generateUID() {
        return Math.floor(1e5 + (Math.random() * 5e5));
    }
    loading() {
        this.spinnerService.show();
    }
}
