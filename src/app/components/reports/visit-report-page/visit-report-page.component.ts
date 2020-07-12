import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Subscription } from "rxjs";
import { WorkOrdersService } from "../../../services/work-orders.service";
import { SupermaketsService } from '../../../services/supermakets.service';
import * as ExcelJS from "node_modules/exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { CustomerService } from '../../../services/customer.service';

declare var $: any;

@Component({ selector: 'app-visit-report-page', templateUrl: './visit-report-page.component.html', styleUrls: ['./visit-report-page.component.css'] })
export class VisitReportPageComponent implements OnInit {
    desde: string = "";
    hasta: string = "";
    realData: any = [];
    preparedData: any = [];
    orderSubscription: Subscription;
    customerSubscription: Subscription;
    storeSubscription: Subscription;
    customerList: any;
    tempIdCustomer: string = '';
    tempNameCustomer: string = '';
    storeList: any;
    constructor(public dialog: MatDialog,
        private spinnerService: Ng4LoadingSpinnerService,
        private ow: WorkOrdersService,
        private cs: CustomerService,
        private sc: SupermaketsService) {
    }

    ngOnInit() {
        $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $('#cmbCustomer').append(new Option('', '', true, true)).trigger('change');
        $('#cmbCustomer').select2({
            placeholder: 'Seleccione...',
            language: {
                'noResults': function () {
                    return '';
                }
            }
        });
        const self = this;
        $('#cmbCustomer').on('select2:select', function (e) {
            const idCustomer = e.params.data.id;
            const nameCustomer = e.params.data.text;
            if (idCustomer != '') {
                self.tempIdCustomer = idCustomer;
                self.tempNameCustomer = nameCustomer;
            }
        });
        this.spinnerService.show();
        this.customerSubscription = this.cs.getCustomer().subscribe(customers => {
            this.spinnerService.hide();
            
            
            this.customerList = customers.filter(ch => ch.estado === 'A').sort((a, b) => {
                return a.razonsocial < b.razonsocial ? -1 : 1;
            });
        });

        this.storeSubscription = this.sc.getSuperStore().subscribe(stores => {
            this.spinnerService.hide();
            this.storeList = stores;
          });
    }

    processReport() {
        let opcion = "";
        if (!$("#fedesde").val() && !$("#fehasta").val()) {
            this.openAlert("Scope Alert", "Debe escoger una fecha de filtro");
            return false;
        }
        /*
        if( this.tempIdCustomer == '') {
            this.openAlert("Scope Alert", "Debe escoger un cliente");
            return false;
        }*/

        if ($("#rd-crea").is(":checked")) {
            opcion = "creacion";
        }
        if ($("#rd-vis").is(":checked")) {
            opcion = "visita";
        }
        let desde = $("#fedesde").val();
        let hasta = $("#fehasta").val();

        let cliente = null;
        let nombreArchivo = 'Informe de Visitas.xlsx';
        if (this.tempIdCustomer != '' && this.tempNameCustomer != '') {
            cliente = {
                'id': this.tempIdCustomer,
                'razonsocial': this.tempNameCustomer.trim()
            }
            nombreArchivo = this.tempNameCustomer + '.xlsx';
        }
        this.spinnerService.show();
        this.orderSubscription = this.ow.getWorkOrdersListFinalizedByCustomer(desde, hasta, opcion, cliente).subscribe(orders => {
            this.spinnerService.hide();
            this.realData = orders;
            if (this.orderSubscription) {
                this.orderSubscription.unsubscribe();
            }
            if (this.realData.length) {
                this.prepareDataFrom().then(data => {
                    //this.customerList = data;
                    if (data) {
                        this.xls(data).then((workbook: ExcelJS.Workbook) => {
                            workbook.xlsx.writeBuffer().then((data) => {
                                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                fs.saveAs(blob, nombreArchivo);
                            });
                        });
                    }
                });
            } else {
                this.openAlert("Scope Alert", "No encontramos órdenes en ese rango de fecha");
            }
        });
    }

    prepareDataFrom() {
        return new Promise((resolve, reject) => {
            try {
                this.spinnerService.show();
                this.realData.forEach(el => {
                    el.cliente.razonsocial = el.cliente.razonsocial.split('.').join('');
                    el['visita'] = el['visita'].substring(0, 10);
                });

                let customers = this.grouping(this.realData, 'cliente', 'razonsocial');
                customers.forEach(cu => {
                    let customerSubscription = this.cs.getBrandFromCustomer(cu.id).subscribe(data => {
                        cu['marcas'] = data;
                        if (customerSubscription) {
                            customerSubscription.unsubscribe();
                        }
                    });
                    let superChain = this.realData.filter(obj => obj.cliente.id == cu.id);
                    cu['cadenas'] = this.grouping(superChain, 'cadena', 'nombre');
                    cu['cadenas'].forEach(sc => {
                        let superStore = this.realData.filter(obj => (obj.cliente.id == cu.id && obj.cadena.id == sc.id));
                        sc['locales'] = this.grouping(superStore, 'local', 'nombre');
                        sc['locales'].forEach(st => {
                            let city = this.storeList.filter(obj => (obj.id == st.id));
                            if(city.length) {
                                st['ciudad'] = city[0].ciudad.trim();
                            }
                        });
                        sc['locales'] = sc['locales'].sort((a, b) => {
                            return (a.ciudad > b.ciudad) ? 1 : -1;
                        });

                        let skuBySuperChain = [];
                        sc['locales'].forEach(st => {
                            let visits = this.realData.filter(obj => (obj.cliente.id == cu.id && obj.cadena.id == sc.id && obj.local.id == st.id));
                            let arrayVisits = this.grouping(visits, 'visita');
                            st['visitas'] = [];
                            arrayVisits.forEach(v => {
                                let visitsFiltered = visits.filter(obj => obj.visita == v);
                                let skus = [];
                                for (var i = 0; i <= (visitsFiltered.length - 1); i++) {
                                    for (var j = 0; j <= (visitsFiltered[i].sku.length - 1); j++) {
                                        var sku = visitsFiltered[i].sku[j];
                                        if (!sku.bloqueado) {
                                            let theSku = {
                                                'marca': sku.ds_marca,
                                                'producto': sku.descripcion,
                                                'presentacion': sku.presentacion,
                                                'sabor': sku.sabor,
                                                'final': parseInt(sku.final)
                                            }
                                            skus.push(theSku);
                                            skuBySuperChain.push(theSku);
                                        }
                                    }
                                }
                                st['visitas'].push({
                                    'visita': v,
                                    'skus': skus
                                });
                            })
                        });
                        let brands = this.grouping(skuBySuperChain, 'marca');
                        sc['tags'] = [];
                        brands.forEach(br => {
                            let arrayProducts = skuBySuperChain.filter(obj => obj.marca == br);
                            let products = this.grouping(arrayProducts, 'producto');
                            products.forEach(pr => {
                                let arrayPresentations = skuBySuperChain.filter(obj => obj.marca == br && obj.producto == pr);
                                let presentations = this.grouping(arrayPresentations, 'presentacion');
                                presentations.forEach(pt => {
                                    let arrayFlavors = skuBySuperChain.filter(obj => obj.marca == br && obj.producto == pr && obj.presentacion == pt);
                                    let flavors = this.grouping(arrayFlavors, 'sabor');
                                    flavors.forEach(fl => {
                                        sc['tags'].push({
                                            'marca': br,
                                            'producto': pr,
                                            'presentacion': pt,
                                            'sabor': fl
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                setTimeout(() => {
                    this.spinnerService.hide();
                    console.log(customers);
                    resolve(customers);
                }, 2000);
            } catch (err) {
                reject(err)
            }
        });
    }

    xls(data) {
        return new Promise((resolve, reject) => {
            try {
                if (data.length) {
                    let seekV = 0;
                    let workbook = new ExcelJS.Workbook();

                    const period = `Desde el ${this.formatDate($('#fedesde').val())}, hasta el ${this.formatDate($('#fehasta').val())}`;

                    data.forEach(customer => {
                        seekV = 0;
                        let worksheet = workbook.addWorksheet(customer.razonsocial);
                        customer.cadenas.forEach(superChain => {
                            seekV += 5;
                            worksheet.addRow([]);
                            worksheet.addRow([customer.razonsocial]).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            worksheet.addRow([superChain.nombre]).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            worksheet.addRow([period]).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            
                            worksheet.mergeCells(`A${seekV - 3}:${this.numToChar(superChain.tags.length + 4)}${seekV - 3}`);
                            worksheet.getCell(`A${seekV - 3}`).alignment = { horizontal: 'center' };
                            worksheet.mergeCells(`A${seekV - 2}:${this.numToChar(superChain.tags.length + 4)}${seekV - 2}`);
                            worksheet.getCell(`A${seekV - 2}`).alignment = { horizontal: 'center' };
                            worksheet.mergeCells(`A${seekV - 1}:${this.numToChar(superChain.tags.length + 4)}${seekV - 1}`);
                            worksheet.getCell(`A${seekV - 1}`).alignment = { horizontal: 'center' };

                            worksheet.addRow(this.setHeaderTitle(['No', 'FECHA', 'CIUDAD', 'LOCALES'], superChain, 'marca')).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            this.mergeHeader(superChain, worksheet, seekV, 'marca');
                            worksheet.addRow(this.setHeaderTitle(['', '', '', ''], superChain, 'producto')).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            this.mergeHeader(superChain, worksheet, seekV + 1, 'producto');
                            worksheet.addRow(this.setHeaderDet(['', '', '', ''], superChain, 'presentacion')).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));
                            //mergeHeader(superChain, worksheet, seekV + 2, 'presentacion');
                            worksheet.addRow(this.setHeaderDet(['', '', '', ''], superChain, 'sabor')).eachCell((cell, num) => this.setStyle(cell, { border: true, font: { bold: true } }));

                            worksheet.mergeCells(`A${seekV}:A${seekV + 3}`);
                            worksheet.getCell(`A${seekV}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(`B${seekV}:B${seekV + 3}`);
                            worksheet.getCell(`B${seekV}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(`C${seekV}:C${seekV + 3}`);
                            worksheet.getCell(`C${seekV}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            worksheet.mergeCells(`D${seekV}:D${seekV + 3}`);
                            worksheet.getCell(`D${seekV}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            seekV += 3;
                            let lengthData = 0;
                            superChain.locales.forEach(superStore => {
                                superStore.visitas.forEach(visit => {
                                    lengthData++;
                                    let finaldata = [lengthData, visit.visita, superStore.ciudad , superStore.nombre];
                                    let minsValues = [];
                                    superChain.tags.forEach(col => {
                                        let skuMatch = visit.skus.filter(sku => sku.marca = col.marca && sku.producto == col.producto && sku.presentacion == col.presentacion && sku.sabor == col.sabor);
                                        let brandMatch = customer.marcas.filter(brand => brand.nombre == col.marca);
                                        if (brandMatch) {
                                            if (brandMatch.length) {
                                                brandMatch = brandMatch[0];
                                            }
                                            if (brandMatch.minimo) {
                                                minsValues.push(parseInt(brandMatch.minimo));
                                            } else {
                                                minsValues.push(0);
                                            }
                                        } else {
                                            minsValues.push(0);
                                        }

                                        if (skuMatch.length) {
                                            let sum = skuMatch.map(o => o.final).reduce((a, c) => { return a + c });
                                            finaldata.push(sum);
                                        } else {
                                            finaldata.push('');
                                        }
                                    });

                                    let row = worksheet.addRow(finaldata);

                                    row.eachCell((cell, num) => {
                                        this.setStyle(cell, { border: true });
                                        if (num > 4 && cell.value === 0) {
                                            cell.fill = {
                                                type: 'pattern',
                                                pattern: 'solid',
                                                fgColor: { argb: 'FF9999' }
                                            }
                                        }
                                        if (num > 4 && minsValues[num - 5] > 0) {
                                            const minimo = parseInt(minsValues[num - 5], 10);
                                            if (cell.value > 0 && cell.value < minimo) {
                                                cell.fill = {
                                                    type: 'pattern',
                                                    pattern: 'solid',
                                                    fgColor: { argb: 'c9c9c9' }
                                                }
                                            }
                                        }
                                    });
                                });
                            });
                            seekV += lengthData;
                        });
                    });
                    resolve(workbook);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    grouping(originalArray, prop, subprop?) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
            var obj = originalArray[i][prop];
            if (subprop) {
                lookupObject[originalArray[i][prop][subprop]] = obj;
            } else {
                lookupObject[originalArray[i][prop]] = obj;
            }
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }

    xlsample() {
        let workbook = new ExcelJS.Workbook();
        const title = 'Car Sell Report';

        const header = ["Year", "Month", "Make", "Model", "Quantity", "Quantity"]
        const data = [
            [2007, 1, "Volkswagen ", "Volkswagen Passat", 1267, 10],
            [2007, 1, "Toyota ", "Toyota Rav4", 819, 6.5],
            [2007, 1, "Toyota ", "Toyota Avensis", 787, 6.2],
            [2007, 1, "Volkswagen ", "Volkswagen Golf", 720, 5.7],
            [2007, 1, "Toyota ", "Toyota Corolla", 691, 5.4],
        ];

        let worksheet = workbook.addWorksheet('Car Data');
        // Add new row
        let titleRow = worksheet.addRow([title]);
        // Set font, size and style in title row.
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        // Blank Row
        worksheet.addRow([]);
        //Add row with current date
        let subTitleRow = worksheet.addRow(['Date : ' + new Date()]);
        //Add Header Row
        let headerRow = worksheet.addRow(header);
        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
        // Add Data and Conditional Formatting
        data.forEach(d => {
            let row = worksheet.addRow(d);
            let qty = row.getCell(5);
            let color = 'FF99FF99';
            if (+qty.value < 500) {
                color = 'FF9999'
            }
            qty.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color }
            }
        });
        worksheet.mergeCells('E4:F4');
        worksheet.getCell('E4').alignment = { horizontal: 'center' };
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'CarData.xlsx');
        });
    }


    formatDate(date) {
        var theDate = new Date(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 1, parseInt(date.substr(8, 2)));
        var monthNames = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre",
            "Noviembre", "Diciembre"
        ];

        var day = theDate.getDate();
        var monthIndex = theDate.getMonth();
        var year = theDate.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    numToChar(number) {
        var numeric = (number - 1) % 26;
        var letter = this.chr(65 + numeric);
        var number2 = (number - 1) / 26;
        if (number2 > 0) {
            return this.numToChar(number2) + letter;
        } else {
            return letter;
        }
    }

    chr(codePt) {
        if (codePt > 0xFFFF) {
            codePt -= 0x10000;
            return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
        }
        return String.fromCharCode(codePt);
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
    setHeaderTitle(array, data, prop) {
        let tag = '';
        data.tags.forEach(sc => {
            if (tag != sc[prop]) {
                array.push(sc[prop]);
                tag = sc[prop];
            } else {
                array.push('');
            }
        });
        return array;
    };

    setHeaderDet(array, data, prop) {
        data.tags.forEach(sc => {
            array.push(sc[prop]);
        });
        return array;
    }

    mergeHeader(data, worksheet, seek, prop) {
        let count = 1;
        let sum = 0;
        let seekH = 4;
        let tag = '';
        data.tags.forEach(sc => {
            seekH++;
            if (tag != sc[prop]) {
                tag = sc[prop];
                if (count > 1) {
                    worksheet.mergeCells(`${this.numToChar(sum)}${seek}:${this.numToChar(seekH - 1)}${seek}`);
                    worksheet.getCell(`${this.numToChar(sum)}${seek}`).alignment = { horizontal: 'center' };
                    count = 1;
                }
                sum = seekH;
            } else {
                count++;
            }
        });
        if (count > 1) {
            worksheet.mergeCells(`${this.numToChar(sum)}${seek}:${this.numToChar(seekH)}${seek}`);
            worksheet.getCell(`${this.numToChar(sum)}${seek}`).alignment = { horizontal: 'center' };
        }
    }

    setStyle(cell, style) {
        if (style.border) {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        }
        if (style.font) {
            cell.font = style.font;
        }
    }

    ngOnDestroy() {
        if (this.customerSubscription) {
            this.customerSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
}
