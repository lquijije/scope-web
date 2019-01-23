import { Component, OnInit } from '@angular/core';
import { ISuperChain } from '../../../models/supermarkets/super-chain';
import { SupermaketsService } from '../../../services/supermakets.service';
import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-super-chain-page',
  templateUrl: './super-chain-page.component.html',
  styleUrls: ['./super-chain-page.component.css']
})
export class SuperChainPageComponent implements OnInit {
  chainList: any;
  constructor(private sc: SupermaketsService) { }

  ngOnInit() {
    console.log(this.sc.getSuperChain());
    this.sc.getSuperChain().subscribe(chains => {
      console.log(chains);
      this.chainList = chains;
    });
  }
  nuevo(){
    $('#pnlEdit').removeClass('d-none');
    $('#pnlList').addClass('d-none');  
  }

  salir(){
    $('#pnlEdit').addClass('d-none');
    $('#pnlList').removeClass('d-none');  
  }
  onSubmit(){}
  
}
