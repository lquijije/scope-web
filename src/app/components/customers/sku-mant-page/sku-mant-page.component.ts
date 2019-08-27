import {Component, OnInit, OnDestroy} from '@angular/core';
import {ISku} from '../../../models/customers/skus';
import {CustomerService} from '../../../services/customer.service';
import {SupermaketsService} from '../../../services/supermakets.service';
import {MatDialog} from '@angular/material';
import {NgForm} from '@angular/forms/src/directives/ng_form';
import {ConfirmDialogComponent} from '../../dialog-components/confirm-dialog/confirm-dialog.component';
import {AlertDialogComponent} from '../../dialog-components/alert-dialog/alert-dialog.component';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Subscription} from 'rxjs';
declare var $: any;

@Component({selector: 'app-sku-mant-page', templateUrl: './sku-mant-page.component.html', styleUrls: ['./sku-mant-page.component.css']})
export class SkuMantPageComponent implements OnInit,
OnDestroy {
    customerList : any;
    brandList : any;
    skuList : any;
    rowSku : any;
    sku : ISku = {
        cliente: '',
        marca: '',
        sku: '',
        descripcion: '',
        presentacion: '',
        sabor: '',
        estado: 'A'
    };
    editState : any = false;
    tempIdCustomer : string = '';
    tempNameCustomer : string = '';
    tempIdBrand : string = '';
    tempNameBrand : string = '';
    actionName : string = '';
    customerSubscription : Subscription;
    constructor(public dialog : MatDialog, private cs : CustomerService, private spinnerService : Ng4LoadingSpinnerService, private supermaketService : SupermaketsService) {}

    ngOnInit() {
        const self = this;
        const n1 = new Option('', '', true, true);
        $('#cmbCustomer').append(n1).trigger('change');
        $('#cmbCustomer').select2({
            placeholder: 'Seleccione Cliente',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        const n2 = new Option('', '', true, true);
        $('#cmbBrand').append(n2).trigger('change');
        $('#cmbBrand').select2({
            placeholder: 'Seleccione Marca',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        $('#cmbCustomer').on('select2:select', function (e) {
            const idCustomer = e.params.data.id;
            const nameCustomer = e.params.data.text;
            if (idCustomer != '') {
                self.tempIdCustomer = idCustomer;
                self.tempNameCustomer = nameCustomer;
                self.skuList = [];
                self.spinnerService.show();
                self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
                    self.spinnerService.hide();
                    self.brandList = brands;
                    const n3 = new Option('', '', true, true);
                    $('#cmbBrand').append(n3).trigger('change');
                });
            }
        });
        $('#cmbBrand').on('select2:select', function (e) {
            if (self.tempIdCustomer != '') {
                const idBrand = e.params.data.id;
                const nameBrand = e.params.data.text;
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
                        // self.skuList.forEach(el => {
                        // el['orden'] = self.skuList.indexOf(el) + 1;
                        // self.cs.updSku(el);
                        // });
                    });
                }
            } else {
                this.openAlert('Scope Alert', 'Escoja un cliente');
            }
        });
        self.spinnerService.show();
        this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
            self.spinnerService.hide();
            this.customerList = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.razonsocial < b.razonsocial ? -1 : 1;
            });
        });
    }
    ngOnDestroy() {
        this.customerSubscription.unsubscribe();
    }
    nuevo() {
        if ($('#cmbCustomer').val() != '') {
            if ($('#cmbBrand').val() != '') {
                this.showEditView();
            } else {
                this.openAlert('Scope Alert!', 'Debe escojer una Marca');
            }
        } else {
            this.openAlert('Scope Alert!', 'Debe escojer un Cliente');
        }
    }
    onSubmit(myForm : NgForm) {
        if (myForm.valid) {

            if (this.sku.sku.trim() === '') {
                this.openAlert('Scope Error', 'SKU no puede estar vacío');
                return;
            }
            if (this.sku.descripcion.trim() === '') {
                this.openAlert('Scope Error', 'Descripción no puede estar vacía');
                return;
            }
            if (this.sku.presentacion.trim() === '') {
                this.openAlert('Scope Esrror', 'Presentación no puede estar vacía');
                return;
            }
            if (!this.editState) {
                this.sku.estado = 'A';
                this.sku.cliente = this.tempIdCustomer;
                this.sku.marca = this.tempIdBrand;
                this.sku.sku = this.sku.sku.toLocaleUpperCase();
                let subSku: Subscription;

                subSku = this.cs.getSkuFromCustomerBrandAndSku(this.tempIdCustomer, this.tempIdBrand, this.sku.sku).subscribe(skus => {
                    if(!skus.length) {
                        this.spinnerService.show();
                        this.cs.addSku(this.sku).then((e) => {
                            this.spinnerService.hide();
                            this.clearObject();
                            this.salir();
                        }).catch(er => {
                            this.spinnerService.hide();
                            this.openAlert('Scope Error', er.message);
                            this.clearObject();
                            this.salir();
                        });
                    } else {
                        this.openAlert('Scope Web', 'Sku ya se encuentra ingresado');
                    }
                    subSku.unsubscribe();
                });

            } else {
                this.spinnerService.show();
                this.cs.updSku(this.sku).then((e) => {
                    this.spinnerService.hide();
                    this.clearObject();
                    this.salir();
                }).catch(er => {
                    this.spinnerService.hide();
                    this.openAlert('Scope Error', er.message);
                    this.clearObject();
                    this.salir();
                });
                this.editState = false;
            }
        } else {
            this.openAlert('Scope Error', 'Aún faltan campos requeridos.');
        }
    }
    salir() {
        this.closeEditView();
    }
    edit(sku : ISku) {
        this.editState = true;
        this.showEditView();
        this.sku = Object.assign({}, sku);

    }
    delete(sku : ISku) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '300px',
            data: {
                title: 'Confirmación',
                msg: 'Desea eliminar el SKU ' + sku.sku + '?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                sku.estado = 'I';
                // this.cs.updSku(sku); // Cambia estado a I
                this.spinnerService.show();
                this.cs.delSku(sku).then((e) => { // Elimina permanentemente de la base
                    this.spinnerService.hide();
                }).catch(er => {
                    this.spinnerService.hide();
                    this.openAlert('Scope Error', er.message);
                });
            }
        });
    }
    showEditView() {
        if (!this.editState) {
            this.actionName = 'Nuevo';
        } else {
            this.actionName = 'Editar';
        }
        $('#pnlEdit').removeClass('d-none');
        $('#pnlList').addClass('d-none');
    }
    closeEditView() {
        $('#pnlEdit').addClass('d-none');
        $('#pnlList').removeClass('d-none');
        this.clearObject();
    }
    clearObject() {
        this.editState = false;
        this.sku = {
            cliente: '',
            marca: '',
            sku: '',
            descripcion: '',
            presentacion: '',
            sabor: '',
            estado: ''
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
    grabarOrden() {
        if (this.skuList.length) {
            this.skuList.forEach(el => {
                el['orden'] = this.skuList.indexOf(el) + 1;
                this.cs.updSku(el);
            });
            let brand = {
                id: this.tempIdBrand,
                nombre: this.tempNameBrand
            };
            let customer = {
                id: this.tempIdCustomer,
                razonsocial: this.tempNameCustomer
            };
            let tempSubscription: Subscription;
            tempSubscription = this.supermaketService.getSkusFromCustomerBrandAssociate(customer, brand).subscribe(associated => {
                if (associated.length) {
                    associated.forEach(assoc => {
                        if (assoc.sku.length) {
                            assoc.sku.forEach(skuAssoc => {
                                this.skuList.forEach(skuOrd => {
                                    if (skuAssoc.sku == skuOrd.sku) {
                                        skuAssoc['orden'] = skuOrd['orden'];
                                    }
                                });
                            });
                            this.cs.updAssocBrand(assoc);
                        }
                        if (associated.indexOf(assoc) + 1 == associated.length) {
                            this.openAlert('Scope Web', 'Se guardó el orden exitosamente!!');
                            tempSubscription.unsubscribe();
                        }
                    });
                } else {
                    this.openAlert('Scope Web', 'Se guardó el orden exitosamente!!');
                }
            });
        } else {
            this.openAlert('Scope Web', 'No hay Skus para guardar');
        }
    }
}
