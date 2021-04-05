import { Component, OnInit } from '@angular/core';
import {SupermaketsService} from '../../../services/supermakets.service';
import {CustomerService} from '../../../services/customer.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {IAssociatedBrands} from 'src/app/models/customers/associated-brands';
import { WorkOrdersService } from '../../../services/work-orders.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-mant-fixes',
  templateUrl: './mant-fixes.component.html',
  styleUrls: ['./mant-fixes.component.css']
})
export class MantFixesComponent implements OnInit {
  itemSubscription : Subscription;
  constructor(private sc : SupermaketsService, private spinnerService : Ng4LoadingSpinnerService,private cs : CustomerService, private ow: WorkOrdersService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if(this.itemSubscription) {
      this.itemSubscription.unsubscribe();
    }
  }

  getAssoc(){
    let cliente = {
      "id": "R5iC6GZfIxGD4gVSIMa6",
      "razonsocial": "CETCA C.A."
    };
    let marca = {
      "id": "BQWN5k2UwgIml9xapErW",
      "nombre": "SANGAY"
    };
    this.itemSubscription = this.sc.getAssocFromBrandAndCustomer(marca, cliente).subscribe(data => {
      console.log(data);
    });
  }
  fixAssoc() {
    let cliente = {
      "id": "R5iC6GZfIxGD4gVSIMa6",
      "razonsocial": "INCREMAR CIA. LTDA."
    };
    let marca = {
      "id": "porve9I6T5NhJGpitebS",
      "nombre": "TAPIOKITA LISTA"
    };
    this.spinnerService.show();
    this.itemSubscription = this.sc.getAssocFromBrandAndCustomer(marca, cliente).subscribe(data => {
      this.spinnerService.hide();
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      // if(data) {
      //   data.forEach(el => {
      //     if(el['marca']) {
      //         //el['cadena'] = { 'id': 'vhnJ0x5eTu4sN8dNSZF4', 'nombre': 'AKI' };
      //         el['marca'] = { 'id': 'LEK6dOn9ZzopfrwfxR2a', 'nombre': 'ALMA VERDE F' };
      //         this.cs.updAssocBrand(el).then(() => {
      //             console.log(`assoc modificada ${el}`);
      //         }).catch((er) => {
      //             console.log(`assoc ${el} error ${er}`);
      //         });
      //     }
      //   });
      // }
      // console.log(data);

      let ping = false;
      if(data) {
        data.forEach(el => {
          ping = false;
          /*this.cs.delAssocBrand(el).then(() => {
            console.log(`assoc eliminada ${el}`);
          }).catch((er) => {
              console.log(`assoc ${el} error ${er}`);
          });*/
          el['marca'] = {
            "id": "ZLgUMnqRBDwWkW8U1uK8",
            "nombre": "TAPIOKITA LISTA"
          };
          if(el['sku']) {
            el['sku'].forEach(sku => {
              if(sku['descripcion'] == 'TAPIOKITA LISTA INSTANTANEA') {
                sku['marca'] = "ZLgUMnqRBDwWkW8U1uK8";
                sku['descripcion'] = "COLADA INSTANTANEA";
                sku['id'] = "zJoldldYVYoNWZK4Eo1r";
                ping = true;
              }
              /*if(sku['id'] == 'voorrbmojXQMxudtV8sG') {
                //sku['marca'] = "LTjKWWeGEmepnOIMMzOh";
                sku['descripcion'] = "SOPA POLLO CON FIDEOS";
                // sku['sabor'] = "TE NEGRO";
                ping = true;
              }*/
            });
            if(ping) {
              this.cs.updAssocBrand(el).then(() => {
                  console.log(`assoc modificada ${el}`);
              }).catch((er) => {
                  console.log(`assoc ${el} error ${er}`);
              });
            } 
          }
        });
      }
    });
  }

  fixAssoc1() {
    let local = {
      "id": "x6cVMv0M64p0kmkUL3oB",
      "nombre": "TERMINAL GUAMANI"
    };
    let chain = {
      "id": "vhnJ0x5eTu4sN8dNSZF4",
      "nombre": "AKI"
    };
    this.spinnerService.show();
    this.itemSubscription = this.sc.getAssocFromLocalAndChain(local, chain).subscribe(data => {
      this.spinnerService.hide();
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      if(data) {
        data.forEach(el => {
          if(el['local']) {
              el['local'] = { 'id': 'x6cVMv0M64p0kmkUL3oB', 'nombre': 'SUPER AKI TERMINAL GUAMANI' };
              //el['marca'] = { 'id': 'LEK6dOn9ZzopfrwfxR2a', 'nombre': 'ALMA VERDE F' };
              this.cs.updAssocBrand(el).then(() => {
                  console.log(`assoc modificada ${el}`);
              }).catch((er) => {
                  console.log(`assoc ${el} error ${er}`);
              });
          }
        });
      }
      console.log(data);
    });
  }

  getOrdersByLocalAndChain(){
    let local = {
      "id": "i0fSpH4e1m1bxryYRNMy",
      "nombre": "GUAJALO"
   };
   let chain = {
      "id": "zAr3tJCCZe8gzTd2al1T",
      "nombre": "FAVORITA"
    };
    this.itemSubscription = this.ow.getWorkOrdersByLocalAndChain(local, chain).subscribe(data => {
      console.log(data);
    });
  }
  fixOrders1() {
    let local = {
        "id": "x6cVMv0M64p0kmkUL3oB",
        "nombre": "TERMINAL GUAMANI"
    };
    let chain = {
      "id": "vhnJ0x5eTu4sN8dNSZF4",
      "nombre": "AKI"
    };
   this.spinnerService.show();
    this.itemSubscription = this.ow.getWorkOrdersByLocalAndChain(local, chain).subscribe(data => {
      this.spinnerService.hide();
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      if(data) {
        data.forEach(el => {
          if(el['local']) {
              el['local'] = { 'id': 'x6cVMv0M64p0kmkUL3oB', 'nombre': 'SUPER AKI TERMINAL GUAMANI' };
              //el['local'] = { 'id': 'TERMINAL GUAMANINMy', 'nombre': 'AKI GUAJALO' };
              this.ow.updWorkOrder(el).then(() => {
                  console.log(`orden modificada ${el}`);
              }).catch((er) => {
                  console.log(`orden ${el} error ${er}`);
              });
          }
        });
      }
    });
  }
  getOrders(){
    let cliente = {
      "id": "R5iC6GZfIxGD4gVSIMa6",
      "razonsocial": "INCREMAR CIA. LTDA."
    };
    this.spinnerService.show();
    this.itemSubscription = this.ow.getWorkOrdersByCustomer(cliente).subscribe(data => {
      this.spinnerService.hide();
      console.log(data);
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      let ping = false;
      if(data) {
        data.forEach(el => {
          ping = false;
          if(el['sku']) {
            el['sku'].forEach(sku => {
              if(sku['cliente'] == 'R5iC6GZfIxGD4gVSIMa6' && sku['marca'] == 'LEK6dOn9ZzopfrwfxR2a') {
                sku['ds_marca'] = 'ALMA VERDE F';
                ping = true;
              }
            });
            if(ping) {
              console.log(el);
            }
          }
        });
      }
    });
  }
  fixOrders() {
    let cliente = {
      "id": "R5iC6GZfIxGD4gVSIMa6",
      "razonsocial": "INCREMAR CIA. LTDA."
    };
    
    let cadena = {
      "id": "RbHlaoQb9NAdvHpvt8wg",
      "nombre": "CORAL"
    };

    // let local = {
		// 	"id": "zjEZYolybfXFbvZtrQPF",
		// 	"nombre": "FENIX"
		// }

    this.spinnerService.show();
    //this.itemSubscription = this.ow.getWorkOrdersByCustomer(cliente).subscribe(data => {
    this.itemSubscription = this.ow.getWorkOrdersByCustomerAndChain(cliente, cadena).subscribe(data => {
    //this.itemSubscription = this.ow.getWorkOrdersByCustomerAndChainAndLocal(cliente, cadena, local).subscribe(data => {
      this.spinnerService.hide();
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      let ping = false;
      if(data) {
        data.forEach(el => {
            if(el['sku']) {
              ping = false;
              el['sku'].forEach(sku => {
   
                if(sku['descripcion'] == 'TAPIOKITA LISTA INSTANTANEA') {
                  sku['descripcion'] = "COLADA INSTANTANEA";
                  //sku['marca'] = "ZLgUMnqRBDwWkW8U1uK8";
                  //sku['id'] = "zJoldldYVYoNWZK4Eo1r";
                  // sku['sabor'] = "TE NEGRO";
                  ping = true;
                }
              });
              if(ping) {
                this.ow.updWorkOrder(el).then(() => {
                  console.log(`orden modificada ${el['numero']}`);
                }).catch((er) => {
                    console.log(`orden ${el['numero']} error ${er}`);
                });
              }
            }
        });
        // data.forEach(el => {
        //   ping = false;
        //   if(el['sku']) {
        //     el['sku'].forEach(sku => {
        //       if((sku['sku'] == '40361819' || sku['sku'] == '40361820') && sku['marca'] == 'bhrBWZsIU4sMEEupbRDE') {
        //         sku['descripcion'] = 'Harina de Platano';
        //         ping = true;
        //       }
        //     });
        //     if(ping) {
        //       this.ow.updWorkOrder(el).then(() => {
        //         console.log(`orden modificada ${el['numero']}`);
        //       }).catch((er) => {
        //           console.log(`orden ${el['numero']} error ${er}`);
        //       });
        //     }
        //   }
        // });
      }
      // let ping = false;
      // if(data) {
      //   data.forEach(el => {
      //     ping = false;
      //     if(el['sku']) {
      //       el['sku'].forEach(sku => {
      //         // if(sku['cliente'] == 'R5iC6GZfIxGD4gVSIMa6' && sku['ds_marca'] == 'TAPIOKITA') {
      //         //   sku['marca'] = "jtMzLDFYdqLENjBiaSwC";
      //         //   ping = true;
      //         // }
      //         if(sku['sku'].includes('40008400')) {
      //           sku['descripcion'] = "TE HORNIMANS X 25";
      //           sku['presentacion'] = "40 GR";
      //           sku['sabor'] = "TE NEGRO";
      //           ping = true;
      //         }
      //         if(sku['sku'].includes('40130862')) {
      //           sku['descripcion'] = "TE VERDE HORNIMANS X25";
      //           sku['presentacion'] = "40 GR";
      //           sku['sabor'] = "TE VERDE";
      //           ping = true;
      //         }
      //         if(sku['sku'].includes('40216408')) {
      //           sku['descripcion'] = "TE VERDE HORNIMANS X25";
      //           sku['presentacion'] = "40 GR";
      //           sku['sabor'] = "MIX SABORES";
      //           ping = true;
      //         }
      //       });
      //       if(ping) {
      //         this.ow.updWorkOrder(el).then(() => {
      //           console.log(`orden modificada ${el['numero']}`);
      //         }).catch((er) => {
      //             console.log(`orden ${el['numero']} error ${er}`);
      //         });
      //       }
      //     }
      //   });
      // }
    });
  }

  getOrderByNumber() {
    this.itemSubscription = this.ow.getWorkOrderbyNumber("10391").subscribe(data => {
      this.spinnerService.hide();
      console.log(data);
      if (this.itemSubscription) {
        this.itemSubscription.unsubscribe();
      }
      let ping = false;
      if(data) {
        data.forEach(el => {
          ping = false;
          if(el['sku']) {
            el['sku'].forEach(sku => {
              if(sku['id'] == 'NDMWVsXjhziDrl59SsDw' && sku['descripcion'] == 'QUINUAVENA') {
                sku['descripcion'] = 'QUINUAVENA SUPERIOR';
                ping = true;
              }
            });
            if(ping) {
              console.log(el);
            }
            this.ow.updWorkOrder(el).then(() => {
              console.log(`orden modificada ${el}`);
            }).catch((er) => {
                console.log(`orden ${el} error ${er}`);
            });
          }
        });
      }
    });
  }
}
