import { Component, OnInit, ɵConsole } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-new-sku-assoc',
  templateUrl: './new-sku-assoc.component.html',
  styleUrls: ['./new-sku-assoc.component.css']
})
export class NewSkuAssocComponent implements OnInit {
  skuListNew: any = [];
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    public dialogRef: MatDialogRef<NewSkuAssocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      console.log(data);
      data.listNative.forEach(native => {
        const outer = data.listCurrent.filter(cur => {
          return cur.id == native.id;
        });
        
        if (outer.length == 0) {
          this.skuListNew.push(native);
        }
      });
    }

  ngOnInit() {

  }
  
  no() {
    this.dialogRef.close(undefined);
  }

  yes() {
    const selft = this;
    let result = []
    $('#table_skus_new tr').each(function(i) {
        var $chkbox = $(this).find('input[type="checkbox"]');
        if($chkbox.length) {
          var checked = $chkbox.prop('checked');
          if(checked) {
            const idSku = $chkbox.attr('value');
            const newSkuPush = selft.skuListNew.filter( item => {
              return item.id == idSku;
            })[0];
            if (newSkuPush) {
              result.push(newSkuPush);
            }
          }            
        }
    });
    this.spinnerService.show();
    const inter = setInterval( () => {
      this.spinnerService.hide();
      this.dialogRef.close(result);
      clearInterval(inter);
    }, 500);    
  }
}
