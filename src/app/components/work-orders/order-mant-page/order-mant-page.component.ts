import { Component, OnInit } from '@angular/core';
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
import * as $ from 'jquery';
import { IAssociatedBrands } from 'src/app/models/customers/associated-brands';
declare var $: any;

@Component({
  selector: 'app-order-mant-page',
  templateUrl: './order-mant-page.component.html',
  styleUrls: ['./order-mant-page.component.css']
})
export class OrderMantPageComponent implements OnInit {
  customerList: any;
  brandList: any;
  chainList: any;
  storeList: any;
  merchantList: any;
  priorityList: any;
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
  constructor(public dialog: MatDialog,
    private cs: CustomerService,
    private sc: SupermaketsService,
    private us: UsersService,
    private ow: WorkOrdersService,
    private gs: GeneralService) { }

  ngOnInit() {
    var self = this;
    $('#calendar').multiDatesPicker({
      dateFormat: "y-m-d",
      beforeShow: function(){    
        $(".ui-datepicker").css('font-size', 5) 
      }
    });
    $('.ui-datepicker').css('font-size', 12);
    $('#txFeVis').datetimepicker({
        format: 'Y-m-d',
        lang: 'es',
        timepicker: false,
        closeOnDateSelect: true
    });
    var n0 = new Option('', '', true, true);
    $('#cmbMerchant').append(n0).trigger('change');
    $('#cmbMerchant').select2({
      placeholder: "Seleccione Mercaderista",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
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
    var n5 = new Option('', '', true, true);
    $('#cmbPriority').append(n5).trigger('change');
    $('#cmbPriority').select2({
      placeholder: "Seleccione Prioridad",
      language: {
          "noResults": function () {
              return "";
          }
      }
    });
    $('#cmbChain').on('select2:select',function(e){
      var idChain = e.params.data.id;
      var nameChain = e.params.data.text;
      if (idChain!=''){
        self.tempIdChain = idChain;
        self.tempNameChain = nameChain;
        self.sc.getSuperStoreFromChainAssociate(
          {
            id: idChain,
            nombre: nameChain
          }
        ).subscribe(stores => {      
          self.storeList = stores;
        });
      }
    });
    $('#cmbStore').on('select2:select',function(e){
      var idStore = e.params.data.id;
      var nameStore = e.params.data.text;
      if (idStore!=''){
        self.tempIdStore = idStore;
        self.tempNameStore = nameStore;
      }
    });
    $('#cmbCustomer').on('select2:select',function(e){
      var idCustomer = e.params.data.id;
      var nameCustomer = e.params.data.text;
      if (idCustomer!=''){
        self.tempIdCustomer = idCustomer;
        self.tempNameCustomer = nameCustomer;
        self.cs.getBrandFromCustomer(idCustomer).subscribe(brands => {      
          self.brandList = brands;
        });
      }
    });
    $('#cmbBrand').on('select2:select',function(e){
      if(self.tempIdCustomer!=''){
        var idBrand = e.params.data.id;
        var nameBrand = e.params.data.text;
        if (idBrand!=''){
          self.tempIdBrand = idBrand;
          self.tempNameBrand = nameBrand;
          self.cs.getSkuFromCustomerAndBrand(self.tempIdCustomer, idBrand).subscribe(skus => {      
            //self.skuList = skus;
          });
        }
      }else{
        this.openAlert('Scope Alert','Escoja un cliente');
      }
    });
    this.cs.getCustomer().subscribe(customers => {
      this.customerList = customers
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.razonsocial < b.razonsocial ? -1 : 1;
        });
    });
    this.sc.getSuperChain().subscribe(chains => {
      this.chainList = chains
      .filter(ch => ch.estado === 'A')
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.us.getMerchants().subscribe(merchants => {
      this.merchantList = merchants
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
    this.gs.getPriority().subscribe(priorities => {
      this.priorityList = priorities
        .sort((a, b) => {
          return a.nombre < b.nombre ? -1 : 1;
        });
    });
  }
  onSubmit(myForm: NgForm){

  }
  calendarizar(){

  }
  limpiar(){

  }
}
