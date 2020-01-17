import {Component, OnInit} from '@angular/core';
declare var $: any;

@Component({selector: 'app-perform-control-page', templateUrl: './perform-control-page.component.html', styleUrls: ['./perform-control-page.component.css']})
export class PerformControlPageComponent implements OnInit {
    desde : string = "";
    hasta : string = "";
    constructor() {}

    ngOnInit() {
        $("#fedesde").datetimepicker({format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true});
        $("#fehasta").datetimepicker({format: "Y-m-d", lang: "es", timepicker: false, closeOnDateSelect: true});
    }
    processReport() {}
}
