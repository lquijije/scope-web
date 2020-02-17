import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AlertDialogComponent } from "../../dialog-components/alert-dialog/alert-dialog.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { Subscription } from "rxjs";
import { WorkOrdersService } from "../../../services/work-orders.service";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Excel from "node_modules/exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';
import { triggerAsyncId } from 'async_hooks';

declare var $: any;

@Component({ selector: 'app-visit-report-page', templateUrl: './visit-report-page.component.html', styleUrls: ['./visit-report-page.component.css'] })
export class VisitReportPageComponent implements OnInit {
    desde: string = "";
    hasta: string = "";
    realData: any = [];
    preparedData: any = [];
    orderSubscription: Subscription;
    private _jsonURL = '../../../../assets/data.json';

    constructor(public dialog: MatDialog,
        private spinnerService: Ng4LoadingSpinnerService,
        private ow: WorkOrdersService,
        private http: HttpClient) { 
    }
    public getJSON(): Observable<any> {
        return this.http.get(this._jsonURL);
    }

    prepareData = () => {
        //const delay = miliseconds => new Promise(resolve => setTimeout(resolve, miliseconds));
        //console.log(this.realData);
        this.spinnerService.show();
        let syncro = 0;
        this.realData.forEach(el => {
            el['cliente'] = {'id': el.sku[0].cliente, 'nombre': el.sku[0].ds_cliente.replace('.','')};
            el['visita'] = el['visita'].substring(0,10);
            syncro++;
        });

        while(syncro < (this.realData.length - 1)){}

        
        /* const groupByCustomer = key => array =>
        array.reduce((objectsByKeyValue, obj) => {
            const value = obj[key];
            objectsByKeyValue[value.nombre] = (objectsByKeyValue[value.nombre] || []).concat(obj.cadena);
            return objectsByKeyValue;
        }, {});
        const groupByCust = groupByCustomer('cliente');
        let headers = groupByCust(this.realData);
        //headers.filter((a, b) => headers.indexOf(a) === b); */
        let customers = this.grouping(this.realData,'cliente','nombre');
        //console.log(customers);
        //syncro = 0;
        customers.forEach(cu => {
            let superChain = this.realData.filter(obj => obj.cliente.id == cu.id);
            cu['cadenas'] = this.grouping(superChain,'cadena','nombre');
            cu['cadenas'].forEach(sc => {
                let superStore = this.realData.filter(obj => (obj.cliente.id == cu.id && obj.cadena.id == sc.id));
                sc['locales'] = this.grouping(superStore,'local','nombre');
                let skuBySuperChain = [];
                sc['locales'].forEach(st => {
                    let visits = this.realData.filter(obj => (obj.cliente.id == cu.id && obj.cadena.id == sc.id && obj.local.id == st.id));
                    let arrayVisits = this.grouping(visits,'visita'); 
                    st['visitas'] = [];
                    arrayVisits.forEach(v => {
                        let visitsFiltered = visits.filter(obj => obj.visita == v);
                        let skus = [];
                        for(var i = 0; i <= (visitsFiltered.length - 1); i++){
                            for(var j = 0; j <= (visitsFiltered[i].sku.length - 1); j++) {
                                var sku = visitsFiltered[i].sku[j];
                                if(!sku.bloqueado) {
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
                let brands = this.grouping(skuBySuperChain,'marca');
                sc['tags'] = [];
                brands.forEach(br => {
                    let arrayProducts = skuBySuperChain.filter(obj => obj.marca == br);
                    let products = this.grouping(arrayProducts, 'producto');
                    products.forEach(pr =>{
                        let arrayPresentations = skuBySuperChain.filter(obj => obj.marca == br && obj.producto == pr);
                        let presentations = this.grouping(arrayPresentations,'presentacion');
                        presentations.forEach(pt => {
                            let arrayFlavors = skuBySuperChain.filter(obj => obj.marca == br && obj.producto == pr && obj.presentacion == pt);
                            let flavors = this.grouping(arrayFlavors,'sabor');
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
        //while(syncro < (customers.length - 1)){}

        //syncro = 0;
        /* customers.forEach(cu => {
            cu.cadenas.forEach(sc => {
                let superStore = this.realData.filter(obj => (obj.cliente.id == cu.id && obj.cadena.id == sc.id));
                sc['locales'] = this.grouping(superStore,'local','nombre');
                syncro++;
            });
        }); */

        this.spinnerService.hide();
        this.preparedData = customers;
        console.log(this.preparedData);
        //this.realData.filter((item, index) => this.realData.indexOf(item) == index);
        //console.log(headers);
    }

    grouping(originalArray, prop, subprop?) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in originalArray) {
            var obj = originalArray[i][prop];
            if (subprop) {
                lookupObject[originalArray[i][prop][subprop]] = obj;
            } else {
                lookupObject[originalArray[i][prop]] = obj;
            }           
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
         return newArray;
    }

    ngOnInit() {
        $("#fedesde").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
        $("#fehasta").datetimepicker({ format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true });
    }

    xlsample() {
        let workbook = new Excel.Workbook();
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
        worksheet.getCell('E4').alignment = { horizontal:'center'} ;
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'CarData.xlsx');
        });
    }

    xls() {
        if(this.preparedData.length) {
            let seekV = 0;
            let workbook = new Excel.Workbook();
            this.preparedData.forEach(customer => {
                seekV = 0;
                let worksheet = workbook.addWorksheet(customer.nombre);
                customer.cadenas.forEach(superChain => {
                    seekV+=5;
                    worksheet.addRow([]);
                    worksheet.addRow(['',customer.nombre]);
                    worksheet.addRow(['',superChain.nombre]);
                    worksheet.addRow(['',`Desde el ${this.formatDate($('#fedesde').val())}, hasta el ${this.formatDate($('#fehasta').val())}`]);

                    worksheet.mergeCells(`B${seekV-3}:${this.numToChar(superChain.tags.length + 4)}${seekV-3}`);
                    worksheet.getCell(`B${seekV-3}`).alignment = { horizontal:'center'} ;
                    worksheet.mergeCells(`B${seekV-2}:${this.numToChar(superChain.tags.length + 4)}${seekV-2}`);
                    worksheet.getCell(`B${seekV-2}`).alignment = { horizontal:'center'} ;
                    worksheet.mergeCells(`B${seekV-1}:${this.numToChar(superChain.tags.length + 4)}${seekV-1}`);
                    worksheet.getCell(`B${seekV-1}`).alignment = { horizontal:'center'} ;
                    
                    let brand = ['','No','FECHA','LOCALES'];
                    let brandTag = '';
                    superChain.tags.forEach(sc => {
                        if(brandTag != sc.marca) {
                            brand.push(sc.marca);
                            brandTag = sc.marca;
                                                   
                        } else {
                            brand.push('');
                        }
                    });
                    worksheet.addRow(brand);

                    let brandCount = 1;
                    let brandSum = 0;
                    let brandSeekH = 4;
                    brandTag = '';
                    superChain.tags.forEach(sc => {
                        brandSeekH++;
                        if(brandTag != sc.marca) {
                            brandTag = sc.marca;
                            if(brandCount > 1) {
                                worksheet.mergeCells(`${this.numToChar(brandSum)}${seekV}:${this.numToChar(brandSeekH-1)}${seekV}`);
                                worksheet.getCell(`${this.numToChar(brandSum)}${seekV}`).alignment = { horizontal:'center'} ;   
                                brandCount = 1;
                            }               
                            brandSum = brandSeekH;   
                        } else {
                            brandCount++;
                        }
                    });
                    if(brandCount > 1) {
                        worksheet.mergeCells(`${this.numToChar(brandSum)}${seekV}:${this.numToChar(brandSeekH)}${seekV}`);
                        worksheet.getCell(`${this.numToChar(brandSum)}${seekV}`).alignment = { horizontal:'center'} ;   
                    } 

                    let products = ['','','',''];
                    let productTag = '';
                    superChain.tags.forEach(sc => {
                        if(productTag != sc.producto) {
                            products.push(sc.producto);
                            productTag = sc.producto;
                        } else {
                            products.push('');
                        }
                    });
                    worksheet.addRow(products);

                    let presentations = ['','','',''];
                    let presentationTag = '';
                    superChain.tags.forEach(sc => {
                        if(presentationTag != sc.presentacion) {
                            presentations.push(sc.presentacion);
                            presentationTag = sc.presentacion;
                        } else {
                            presentations.push('');
                        }
                    });
                    worksheet.addRow(presentations);

                    let flavors = ['','','',''];
                    superChain.tags.forEach(sc => {
                        flavors.push(sc.sabor);
                    });
                    worksheet.addRow(flavors);

                    worksheet.mergeCells(`B${seekV}:B${seekV + 3}`);
                    worksheet.getCell(`B${seekV}`).alignment = { vertical:'middle'} ;
                    worksheet.mergeCells(`C${seekV}:C${seekV + 3}`);
                    worksheet.getCell(`C${seekV}`).alignment = { vertical:'middle'} ;
                    worksheet.mergeCells(`D${seekV}:D${seekV + 3}`);
                    worksheet.getCell(`D${seekV}`).alignment = { vertical:'middle'} ;
                    seekV+=3;
                    let lengthData = 0;
                    superChain.locales.forEach(superStore => {
                        superStore.visitas.forEach(visit =>{
                            worksheet.addRow(['', '', visit.visita, superStore.nombre]);
                            lengthData++;
                        });
                    });
                    seekV+=lengthData;
                });
            });
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, 'Informe de Visitas.xlsx');
            });
        }
    }

    formatDate(date) {
        var theDate = new Date(parseInt(date.substr(0, 4)),parseInt(date.substr(5, 2))-1, parseInt(date.substr(8, 2)));
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
    
    numToChar = function(number)    {
        var numeric = (number - 1) % 26;
        var letter = this.chr(65 + numeric);
        var number2 = (number - 1) / 26;
        if (number2 > 0) {
            return this.numToChar(number2) + letter;
        } else {
            return letter;
        }
    }

    chr = function (codePt) {
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

    processReport() {
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
        this.getJSON().subscribe(data => {
            //console.log(data);
            this.realData = data;
            this.prepareData();
        }); 
        /* this.spinnerService.show();
        this.orderSubscription = this.ow.getWorkOrdersListFinalized(desde, hasta, opcion).subscribe(orders => {
            this.spinnerService.hide();
            this.realData = orders;
            if (this.orderSubscription) {
                this.orderSubscription.unsubscribe();
            }
            if(this.realData.length) {
                //this.prepareData();
                console.log(this.realData);
            }
        }); */
    }
}
