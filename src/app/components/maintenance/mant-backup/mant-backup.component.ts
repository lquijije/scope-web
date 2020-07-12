import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { GeneralService } from '../../../services/general.service';
import { Subscription } from "rxjs";

declare var $: any;
@Component({
  selector: 'app-mant-backup',
  templateUrl: './mant-backup.component.html',
  styleUrls: ['./mant-backup.component.css']
})
export class MantBackupComponent implements OnInit {
  itemSubscription: Subscription;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private gs: GeneralService) { }

  ngOnInit() {
    const n0 = new Option('', '', true, true);
    $('#cboDocuments').append(n0).trigger('change');
    $('#cboDocuments').select2({
        placeholder: 'Seleccione Archivo de datos',
        language: {
            'noResults': function () {
                return '';
            }
        }
    });
  }

  download() {
    let document = $('#cboDocuments').val();
    if(document) {
      this.spinnerService.show();
      this.itemSubscription = this.gs.getDocument(document).subscribe(data => {
        this.spinnerService.hide();
        if(data) {
          this.downloadObjectAsJson(data, document + new Date().toJSON().slice(0,19));
        }
      });
    }    
  }
  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
