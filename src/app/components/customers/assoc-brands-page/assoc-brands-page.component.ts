import {Component, OnInit, OnDestroy} from '@angular/core';
import {ISku} from '../../../models/customers/skus';
import {ISuperStore} from 'src/app/models/supermarkets/super-store';
import {CustomerService} from '../../../services/customer.service';
import {SupermaketsService} from '../../../services/supermakets.service';
import {MatDialog} from '@angular/material';
import {NgForm} from '@angular/forms/src/directives/ng_form';
import {ConfirmDialogComponent} from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import {AlertDialogComponent} from '../../dialog-components/alert-dialog/alert-dialog.component';
import {NewSkuAssocComponent} from '../../dialog-components/new-sku-assoc/new-sku-assoc.component';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ExcelService} from '../../../services/excel.service';
import {IAssociatedBrands} from 'src/app/models/customers/associated-brands';
import {IAssociatedLogs} from 'src/app/models/logs/assoc-logs';
import {Subscription} from 'rxjs';
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
    nombre?: string;
}
@Component({selector: 'app-assoc-brands-page', templateUrl: './assoc-brands-page.component.html', styleUrls: ['./assoc-brands-page.component.css']})
export class AssocBrandsPageComponent implements OnInit,
OnDestroy {
    assocList : any;
    customerList : any;
    brandList : any;
    chainList : any;
    storeList : any;
    customerListFilter : any;
    brandListFilter : any;
    chainListFilter : any;
    storeListFilter : any;
    chainObjFilter : IChainObj;
    customerObjFilter : ICustomerObj;
    storeObjFilter : IStoreObj;
    brandObjFilter : IBrandObj;
    skuList : any;
    skuDel: any = [];
    skuIns: any = [];
    assocBrandList : any;
    tempIdChain : string;
    tempNameChain : string;
    tempIdStore : string;
    tempNameStore : string;
    tempIdCustomer : string;
    tempNameCustomer : string;
    tempIdBrand : string;
    tempNameBrand : string;
    editState : any = false;
    actionName : string = '';
    rowSku : any;
    associatedBrand : IAssociatedBrands = {
        cadena: {
            id: '',
            nombre: ''
        },
        local: {
            id: '',
            nombre: ''
        },
        cliente: {
            id: '',
            razonsocial: ''
        },
        marca: {
            id: '',
            nombre: ''
        },
        sku: []
    }
    //associatedLog : IAssociatedLogs = {};
    assocBrandDetail : any = {
        cadena: '',
        local: '',
        cliente: '',
        marca: '',
        sku: []
    };
    customerSubscription : Subscription;
    superChainSubscription : Subscription;
    assocSubscription : Subscription;
    constructor(public dialog : MatDialog, private cs : CustomerService, private sc : SupermaketsService, private spinnerService : Ng4LoadingSpinnerService, private excelService : ExcelService) {}

    ngOnInit() {
        var self = this;
        $("#txSearch").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#table_brands tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $('#cmbChain').on('select2:select', function (e) {

            var idChain = e.params.data.id;
            var nameChain = e.params.data.text.trim();
            if (idChain != '') {
                self.tempIdChain = idChain;
                self.tempNameChain = nameChain;
                self.spinnerService.show();
                self.sc.getSuperStoreFromChain(idChain).subscribe(stores => {
                    self.spinnerService.hide();
                    self.storeList = stores;
                });
            }
        });
        $('#cmbStore').on('select2:select', function (e) {
            var idStore = e.params.data.id;
            var nameStore = e.params.data.text.trim();
            if (idStore != '') {
                self.tempIdStore = idStore;
                self.tempNameStore = nameStore;
            }
        });
        $('#cmbCustomer').on('select2:select', function (e) {
            var idCustomer = e.params.data.id;
            var nameCustomer = e.params.data.text.trim();
            if (idCustomer != '') {
                self.tempIdCustomer = idCustomer;
                self.tempNameCustomer = nameCustomer;
                self.spinnerService.show();
                self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
                    self.spinnerService.hide();
                    self.brandList = brands;
                });
            }
        });
        $('#cmbBrand').on('select2:select', function (e) {
            if (self.tempIdCustomer != '') {
                var idBrand = e.params.data.id;
                var nameBrand = e.params.data.text.trim();
                if (idBrand != '') {
                    self.tempIdBrand = idBrand;
                    self.tempNameBrand = nameBrand;
                    self.spinnerService.show();
                    self.cs.getSkuFromCustomerAndBrand(self.tempIdCustomer, idBrand).subscribe(skus => {
                        self.spinnerService.hide();
                        self.skuList = skus;
                        self.skuList = self.skuList.sort((a, b) => {
                            return((a.orden < b.orden) ? -1 : 0);
                        });
                        const inter = setInterval(() => {
                            $('#table_skus tbody tr').click(function (e) {
                                self.rowSku = $(this)[0].sectionRowIndex;
                                $('#table_skus tbody tr').removeClass("highlight");
                                $(this).addClass("highlight");
                            });
                            clearInterval(inter);
                        }, 500);
                    });
                }
            } else {
                this.openAlert('Scope Alert', 'Escoja un cliente');
            }
        });
        const n1 = new Option('', '', true, true);
        $('#cmbChainFilter').append(n1).trigger('change');
        $('#cmbChainFilter').select2({
            placeholder: 'Seleccione Cadena',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        const n2 = new Option('', '', true, true);
        $('#cmbCustomerFilter').append(n2).trigger('change');
        $('#cmbCustomerFilter').select2({
            placeholder: 'Seleccione Cliente',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        const n3 = new Option('', '', true, true);
        $('#cmbStoreFilter').append(n3).trigger('change');
        $('#cmbStoreFilter').select2({
            placeholder: 'Seleccione Local',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        const n4 = new Option('', '', true, true);
        $('#cmbBrandFilter').append(n4).trigger('change');
        $('#cmbBrandFilter').select2({
            placeholder: 'Seleccione Marca',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        $('#cmbChainFilter').on('select2:select', function (e) {
            const idChain = e.params.data.id;
            const nameChain = e.params.data.text.trim();
            if (idChain !== '') {
                self.chainObjFilter = {
                    id: idChain,
                    nombre: nameChain
                };
                self.storeListFilter = [];
                self.spinnerService.show();
                self.sc.getSuperStoreFromChain(self.chainObjFilter.id).subscribe(stores => {
                    self.spinnerService.hide();
                    if (stores) {
                        self.storeListFilter = stores as ISuperStore;
                    }
                });
            }
        });
        $('#cmbStoreFilter').on('select2:select', function (e) {
            const idStore = e.params.data.id;
            const nameStore = e.params.data.text.trim();
            if (idStore !== '') {
                self.storeObjFilter = {
                    id: idStore,
                    nombre: nameStore
                };
            }
        });
        $('#cmbCustomerFilter').on('select2:select', function (e) {
            const idCustomer = e.params.data.id;
            const nameCustomer = e.params.data.text.trim();
            if (idCustomer !== '') {
                self.customerObjFilter = {
                    id: idCustomer,
                    razonsocial: nameCustomer
                };
                self.brandListFilter = [];
                self.spinnerService.show();
                self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
                    self.spinnerService.hide();
                    if (brands) {
                        self.brandListFilter = brands;
                    }
                });
            }
        });

        $('#cmbBrandFilter').on('select2:select', function (e) {
            const idBrand = e.params.data.id;
            const nameBrand = e.params.data.text.trim();
            if (idBrand !== '') {
                self.brandObjFilter = {
                    id: idBrand,
                    nombre: nameBrand
                };
            }
        });

        this.spinnerService.show();
        this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
            this.spinnerService.hide();
            this.customerList = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.razonsocial < b.razonsocial ? -1 : 1;
            });
            this.customerListFilter = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.razonsocial < b.razonsocial ? -1 : 1;
            });
        });
        this.superChainSubscription = this.sc.getSuperChain().subscribe(chains => {
            this.spinnerService.hide();
            this.chainList = chains.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.nombre < b.nombre ? -1 : 1;
            });
            this.chainListFilter = chains.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.nombre < b.nombre ? -1 : 1;
            });
        });
        /*this.assocSubscription = this.cs.getAssociatedBrands().subscribe(assocBrands => {
            this.spinnerService.hide();
            this.assocBrandList = assocBrands;
            this.assocList = assocBrands;
        });*/
    }
    ngOnDestroy() {
        if(this.customerSubscription) {
            this.customerSubscription.unsubscribe();
        }
        if(this.superChainSubscription) {
            this.superChainSubscription.unsubscribe();
        }
        if(this.assocSubscription) {
            this.assocSubscription.unsubscribe();
        }
    }
    onSubmit(myForm : NgForm) {
        if ($('#cmbChain').val() != '') {
            if ($('#cmbStore').val() != '') {
                if ($('#cmbCustomer').val() != '') {
                    if ($('#cmbBrand').val() != '') {
                        if (!this.editState) {
                            this.spinnerService.show();
                            let tempSubscription: Subscription;
                            tempSubscription = this.sc.getSkusFromChainStoreCustomerBrandAssociate({
                                id: this.tempIdChain,
                                nombre: this.tempNameChain
                            }, {
                                id: this.tempIdStore,
                                nombre: this.tempNameStore
                            }, {
                                id: this.tempIdCustomer,
                                razonsocial: this.tempNameCustomer
                            }, {
                                id: this.tempIdBrand,
                                nombre: this.tempNameBrand
                            }).subscribe(associated => {
                                this.spinnerService.hide();
                                tempSubscription.unsubscribe();
                                if (associated.length) {
                                    this.openAlert('Scope Web', 'Ya existe la associación solicitada.');
                                    return false;
                                } else {
                                    this.associatedBrand.cliente = {
                                        id: this.tempIdCustomer,
                                        razonsocial: this.tempNameCustomer
                                    };
                                    this.associatedBrand.marca = {
                                        id: this.tempIdBrand,
                                        nombre: this.tempNameBrand
                                    };
                                    this.associatedBrand.cadena = {
                                        id: this.tempIdChain,
                                        nombre: this.tempNameChain
                                    };
                                    this.associatedBrand.local = {
                                        id: this.tempIdStore,
                                        nombre: this.tempNameStore
                                    };

                                    this.associatedBrand.sku = this.skuList;

                                    this.skuList.forEach(skuX => {
                                        let associatedLog : IAssociatedLogs = {};
                                        let d = new Date();
                                        const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
                                        associatedLog.fecha = datestring;
                                        associatedLog.accion = 'INGRESO';
                                        associatedLog.cadena = this.associatedBrand.cadena;
                                        associatedLog.cliente = this.associatedBrand.cliente;
                                        associatedLog.local = this.associatedBrand.local;
                                        associatedLog.marca = this.associatedBrand.marca;
                                        associatedLog.sku = skuX;
                                        
                                        this.cs.addAssocLog(associatedLog);
                                    });

                                    this.spinnerService.show();
                                    this.cs.addAssocBrand(this.associatedBrand).then(() => {

                                        this.spinnerService.hide();
                                    }).catch(er => {
                                        this.spinnerService.hide();
                                        this.openAlert('Scope Error', er.message);
                                    });
                                    this.clearObject();
                                    this.salir();
                                }
                            });
                        } else {
                            this.skuDel.forEach(skuX => {
                                let associatedLog : IAssociatedLogs = {};
                                let d = new Date();
                                const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
                                associatedLog.fecha = datestring;
                                associatedLog.accion = 'ELIMINADO';
                                associatedLog.cadena = this.associatedBrand.cadena;
                                associatedLog.cliente = this.associatedBrand.cliente;
                                associatedLog.local = this.associatedBrand.local;
                                associatedLog.marca = this.associatedBrand.marca;
                                associatedLog.sku = skuX;
                                
                                this.cs.addAssocLog(associatedLog);
                            });
                            this.skuIns.forEach(skuX => {
                                let associatedLog : IAssociatedLogs = {};
                                let d = new Date();
                                const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
                                associatedLog.fecha = datestring;
                                associatedLog.accion = 'INGRESO';
                                associatedLog.cadena = this.associatedBrand.cadena;
                                associatedLog.cliente = this.associatedBrand.cliente;
                                associatedLog.local = this.associatedBrand.local;
                                associatedLog.marca = this.associatedBrand.marca;
                                associatedLog.sku = skuX;
                                
                                this.cs.addAssocLog(associatedLog);
                            });
                            this.cs.updAssocBrand(this.associatedBrand);
                            this.editState = false;
                            this.clearObject();
                            this.salir();
                            this.skuDel = [];
                            this.skuIns = [];
                        }
                    } else {
                        this.openAlert('Scope Alert!', 'Debe escojer una Marca');
                    }
                } else {
                    this.openAlert('Scope Alert!', 'Debe escojer un Cliente');
                }
            } else {
                this.openAlert('Scope Alert!', 'Debe escojer un Local');
            }
        } else {
            this.openAlert('Scope Alert!', 'Debe escojer una Cadena');
        }
    }
    nuevo() {
        this.showEditView();
    }
    deleteSku(sku : ISku) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: {
                title: 'Confirmación',
                msg: 'Desea excluir el SKU ' + sku.sku + '?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                const index: number = this.skuList.indexOf(sku);
                if (index !== -1) {
                    this.skuList.splice(index, 1);
                    this.skuDel.push(sku);
                    console.log(this.skuDel);
                }
            }
        });
    }
    delete(assoc : IAssociatedBrands) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: {
                title: 'Confirmación',
                msg: 'Desea eliminar la Asociaci&oacute;n selecionada?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) { // this.cs.updBrand(brand); // Cambia estado a I
                assoc.sku.forEach(skuX => {
                    let associatedLog : IAssociatedLogs = {};
                    let d = new Date();
                    const datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
                    associatedLog.fecha = datestring;
                    associatedLog.accion = 'ELIMINADO';
                    associatedLog.cadena = assoc.cadena;
                    associatedLog.cliente = assoc.cliente;
                    associatedLog.local = assoc.local;
                    associatedLog.marca = assoc.marca;
                    associatedLog.sku = skuX;
                    
                    this.cs.addAssocLog(associatedLog);
                });

                this.spinnerService.show();
                this.cs.delAssocBrand(assoc).then(() => { // Elimina permanentemente de la base
                    this.spinnerService.hide();
                }).catch(er => {
                    this.spinnerService.hide();
                    this.openAlert('Scope Error', er.message);
                });
            }
        });
    }
    details(assoc : IAssociatedBrands) {
        this.assocBrandDetail = assoc;
        this.assocBrandDetail.sku = assoc.sku.sort((a, b) => {
            return((a.orden < b.orden) ? -1 : 0);
        });
        this.showDetailView();
    }
    salir() {
        this.closeEditView();
        this.clearObject();
    }
    showEditView() {
        if (!this.editState) {
            this.actionName = 'Nueva';
        } else {
            this.actionName = 'Editar';
        }
        $('#pnlEdit').removeClass('d-none');
        $('#pnlList').addClass('d-none');
        var n1 = new Option('', '', true, true);
        $('#cmbChain').append(n1).trigger('change');
        $('#cmbChain').select2({
            placeholder: "Seleccione Cadena",
            language: {
                "noResults": function () {
                    return "";
                }
            }
        });
        var n2 = new Option('', '', true, true);
        $('#cmbCustomer').append(n2).trigger('change');
        $('#cmbCustomer').select2({
            placeholder: "Seleccione Cliente",
            language: {
                "noResults": function () {
                    return "";
                }
            }
        });
        var n3 = new Option('', '', true, true);
        $('#cmbStore').append(n3).trigger('change');
        $('#cmbStore').select2({
            placeholder: "Seleccione Local",
            language: {
                "noResults": function () {
                    return "";
                }
            }
        });
        var n4 = new Option('', '', true, true);
        $('#cmbBrand').append(n4).trigger('change');
        $('#cmbBrand').select2({
            placeholder: "Seleccione Marca",
            language: {
                "noResults": function () {
                    return "";
                }
            }
        });
    }
    showDetailView() {
        this.actionName = 'Detalle';
        $('#pnlDetail').removeClass('d-none');
        $('#pnlList').addClass('d-none');
    }
    closeEditView() {
        $('#pnlEdit').addClass('d-none');
        $('#pnlDetail').addClass('d-none');
        $('#pnlList').removeClass('d-none');
    }
    clearObject() {
        this.editState = false;
        this.skuList = [];
        this.storeList = [];
        this.brandList = [];
        this.associatedBrand = {
            cadena: {
                id: '',
                nombre: ''
            },
            local: {
                id: '',
                nombre: ''
            },
            cliente: {
                id: '',
                razonsocial: ''
            },
            marca: {
                id: '',
                nombre: ''
            },
            sku: []
        };
    }
    openAlert(tit : string, msg : string): void {
        const dialogRef = this.dialog.open(AlertDialogComponent, {
            width: '25%',
            data: {
                title: tit,
                msg: msg
            }
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }
    edit(assoc : IAssociatedBrands) {
        const self = this;
        this.editState = true;
        this.showEditView();
        this.selectCustomerByAssoc(assoc);
        this.selectChainByAssoc(assoc);

        this.skuList = assoc.sku.sort((a, b) => {
            return((a.orden < b.orden) ? -1 : 0);
        });
        console.log(this.skuList);
        const inter = setInterval(() => {
            $('#table_skus tbody tr').click(function (e) {
                self.rowSku = $(this)[0].sectionRowIndex;
                $('#table_skus tbody tr').removeClass("highlight");
                $(this).addClass("highlight");
            });
            clearInterval(inter);
        }, 500);
        this.associatedBrand = Object.assign({}, assoc);
    }
    selectChainByAssoc(assoc : IAssociatedBrands) {
        $('#cmbChain').val($("#cmbChain option:contains('" + assoc.cadena.nombre + "')").val()).trigger('change');
        this.spinnerService.show();
        this.sc.getSuperStoreFromChain(assoc.cadena.id).subscribe(stores => {
            this.spinnerService.hide();
            this.storeList = stores;
            const inter = setInterval(() => {
                $('#cmbStore').val(assoc.local.id).trigger('change');
                clearInterval(inter);
            }, 500);

        });
    }
    selectCustomerByAssoc(assoc : IAssociatedBrands) {
        $('#cmbCustomer').val($("#cmbCustomer option:contains('" + assoc.cliente.razonsocial + "')").val()).trigger('change');
        this.spinnerService.show();
        this.cs.getBrandFromCustomer(assoc.cliente.id).subscribe(brands => {
            this.spinnerService.hide();
            this.brandList = brands;
            const inter = setInterval(() => {
                $('#cmbBrand').val(assoc.marca.id).trigger('change');
                clearInterval(inter);
            }, 500);
        });
    }
    exportar() {
        let exportJson = [];
        if (this.assocBrandList.length > 0) {
            this.assocBrandList.forEach(assocBrand => {
                assocBrand.sku.forEach(skuItem => {
                    exportJson.push({
                        'Cadena': assocBrand.cadena.nombre,
                        'Local': assocBrand.local.nombre,
                        'Cliente': assocBrand.cliente.razonsocial,
                        'Marca': assocBrand.marca.nombre,
                        'Producto': skuItem.descripcion,
                        'Presentación': skuItem.presentacion,
                        'Sabor': skuItem.sabor
                    });
                });
            });
            this.excelService.exportAsExcelFile(exportJson, 'asociaciones');
        }
    }
    move(array, element, delta) {
        var index = array.indexOf(element);
        var newIndex = index + delta;
        if (newIndex < 0 || newIndex == array.length) 
            return;
        


        // Already at the top or bottom.
        this.rowSku = newIndex;
        this.array_move(array, index, newIndex);
    };
    up() {
        if (this.rowSku !== undefined) {
            this.move(this.skuList, this.skuList[this.rowSku], -1);
        }
    }
    down() {
        if (this.rowSku !== undefined) {
            this.move(this.skuList, this.skuList[this.rowSku], 1);
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
    }

    addSku() {
        const idCustomer = this.associatedBrand.cliente.id;
        const idBrand = this.associatedBrand.marca.id;
        this.spinnerService.show();
        this.cs.getSkuFromCustomerAndBrand(idCustomer, idBrand).subscribe(skusNative => {
            this.spinnerService.hide();
            if (skusNative) {

                const dialogRef = this.dialog.open(NewSkuAssocComponent, {
                    width: '60%',
                    data: {
                        listNative: skusNative,
                        listCurrent: this.skuList
                    }
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        result.forEach(rs => {
                            this.skuList.push(rs);
                            this.skuIns.push(rs);
                        });
                    }
                });
            }
        });
    }

    limpiar() {
        this.storeListFilter = [];
        this.brandListFilter = [];
        $('#cmbChainFilter').val('').trigger('change');
        $('#cmbCustomerFilter').val('').trigger('change');
        $('#cmbMerchantFilter').val('').trigger('change');
        $('#cmbStatusFilter').val('').trigger('change');
    }
    consultar() {
        this.assocBrandList = this.assocList;
        let chain = null;
        let store = null;
        let customer = null;
        let brand = null;

        if ($('#cmbChainFilter').val() !== '') {
            // this.assocBrandList = this.assocBrandList.filter(e => {
            //     return e.cadena.id === this.chainObjFilter.id;
            // });
            chain = this.chainObjFilter;
        }
        if ($('#cmbStoreFilter').val() !== '') {
            // this.assocBrandList = this.assocBrandList.filter(e => {
            //     return e.local.id === this.storeObjFilter.id;
            // });
            store = this.storeObjFilter;
        }
        if ($('#cmbCustomerFilter').val() !== '') {
            // this.assocBrandList = this.assocBrandList.filter(e => {
            //     return e.cliente.id === this.customerObjFilter.id;
            // });
            customer = this.customerObjFilter;
        }
        if ($('#cmbBrandFilter').val() !== '') {
            // this.assocBrandList = this.assocBrandList.filter(e => {
            //     return e.marca.id === this.brandObjFilter.id;
            // });
            brand = this.brandObjFilter;
        }
        this.spinnerService.show();
        this.assocSubscription = this.cs.getAssociatedBrandsByAll(chain, store, customer, brand).subscribe(assocBrands => {
            this.spinnerService.hide();
            this.assocBrandList = assocBrands;
            this.assocList = assocBrands;
        });
    }
}
