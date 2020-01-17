import {Component, OnInit} from '@angular/core';
declare var $: any;

@Component({selector: 'app-visit-report-page', templateUrl: './visit-report-page.component.html', styleUrls: ['./visit-report-page.component.css']})
export class VisitReportPageComponent implements OnInit {
    desde : string = "";
    hasta : string = "";
    constructor() {}

    ngOnInit() {
        $("#fedesde").datetimepicker({format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true});
        $("#fehasta").datetimepicker({format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true});
    }

    processReport() {}
}
