import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../../services/customer.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {MatDialog} from '@angular/material';
import {AlertDialogComponent} from '../../dialog-components/alert-dialog/alert-dialog.component';
import {Subscription} from 'rxjs';
declare var $: any;
@Component({selector: 'app-settings-page', templateUrl: './settings-page.component.html', styleUrls: ['./settings-page.component.css']})
export class SettingsPageComponent implements OnInit {
    customerList : any;
    tempIdCustomer : string = '';
    tempNameCustomer : string = '';
    brandList : any;
    customerSubscription : Subscription;
    constructor(public dialog : MatDialog, private spinnerService : Ng4LoadingSpinnerService, private cs : CustomerService) {}

    ngOnInit() {
        const self = this;
        const n1 = new Option('', '', true, true);
        $('#cmbCustomer').append(n1).trigger('change');
        $('#cmbCustomer').select2({
            placeholder: 'Seleccione...',
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
                self.spinnerService.show();
                self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {
                    self.spinnerService.hide();
                    self.brandList = brands;
                });
            }
        });
        this.spinnerService.show();
        this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
            this.spinnerService.hide();
            this.customerList = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.razonsocial < b.razonsocial ? -1 : 1;
            });
        });
    }
    grabar() {
        let c = 0;
        this.spinnerService.show();
        this.brandList.forEach(brand => {
            this.cs.updBrand(brand).then(() => {
                c++;
            }).catch(er => {
                c++;
                this.openAlert('Scope Error', er.message);
            });
            if (c == this.brandList.lenght) {
                this.spinnerService.hide();
            }
            this.cs.updBrand(brand).then(() => {
                this.spinnerService.hide();
            }).catch(er => {
                this.spinnerService.hide();
                this.openAlert('Scope Error', er.message);
            });
        });
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
}
