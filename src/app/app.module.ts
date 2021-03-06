import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material';

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RegisterPageComponent} from './components/register-page/register-page.component';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {AlertDialogComponent} from './components/dialog-components/alert-dialog/alert-dialog.component';

import {AuthService} from './services/auth.service';
import {UsersService} from './services/users.service';
import {SupermaketsService} from './services/supermakets.service';
import {CustomerService} from './services/customer.service';
import {GeneralService} from './services/general.service';
import {WorkOrdersService} from './services/work-orders.service';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';

import {HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import {UserManPageComponent} from './components/users/user-man-page/user-man-page.component';
import {UserChangePassPageComponent} from './components/users/user-change-pass-page/user-change-pass-page.component';
import {SuperChainPageComponent} from './components/supermarkets/super-chain-page/super-chain-page.component';
import {SuperStorePageComponent} from './components/supermarkets/super-store-page/super-store-page.component';
import {CustomerMantPageComponent} from './components/customers/customer-mant-page/customer-mant-page.component';
import {BrandMantPageComponent} from './components/customers/brand-mant-page/brand-mant-page.component';
import {SkuMantPageComponent} from './components/customers/sku-mant-page/sku-mant-page.component';
import {AssocBrandsPageComponent} from './components/customers/assoc-brands-page/assoc-brands-page.component';
import {OrderMantPageComponent} from './components/work-orders/order-mant-page/order-mant-page.component';
import {OrderInquiryPageComponent} from './components/work-orders/order-inquiry-page/order-inquiry-page.component';
import {ConfirmDialogComponent} from './components/dialog-components/confirm-dialog/confirm-dialog.component';
import {ZonePageComponent} from './components/supermarkets/zone-page/zone-page.component';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {UniquePipe} from './pipes/unique.pipe';
import {NewSkuAssocComponent} from './components/dialog-components/new-sku-assoc/new-sku-assoc.component';
import {PerformControlPageComponent} from './components/reports/perform-control-page/perform-control-page.component';
import {VisitReportPageComponent} from './components/reports/visit-report-page/visit-report-page.component';
import { SettingsPageComponent } from './components/reports/settings-page/settings-page.component';
import { MantOrdersComponent } from './components/maintenance/mant-orders/mant-orders.component';
import { MantImagesComponent } from './components/maintenance/mant-images/mant-images.component';
import { MantBackupComponent } from './components/maintenance/mant-backup/mant-backup.component';
import { MantFixesComponent } from './components/maintenance/mant-fixes/mant-fixes.component';
import { FrontReportPageComponent } from './components/reports/front-report-page/front-report-page.component';
import { NewVsBlockedComponent } from './components/reports/new-vs-blocked/new-vs-blocked.component';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        NavbarComponent,
        RegisterPageComponent,
        LoginPageComponent,
        NotFoundPageComponent,
        AlertDialogComponent,
        UserManPageComponent,
        UserChangePassPageComponent,
        SuperChainPageComponent,
        SuperStorePageComponent,
        CustomerMantPageComponent,
        BrandMantPageComponent,
        SkuMantPageComponent,
        AssocBrandsPageComponent,
        OrderMantPageComponent,
        OrderInquiryPageComponent,
        ConfirmDialogComponent,
        ZonePageComponent,
        UniquePipe,
        NewSkuAssocComponent,
        PerformControlPageComponent,
        VisitReportPageComponent,
        SettingsPageComponent,
        MantOrdersComponent,
        MantImagesComponent,
        MantBackupComponent,
        MantFixesComponent,
        FrontReportPageComponent,
        NewVsBlockedComponent
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebaseConfig),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        AppRoutingModule,
        FormsModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        Ng4LoadingSpinnerModule.forRoot()
    ],
    entryComponents: [
        AlertDialogComponent, ConfirmDialogComponent, NewSkuAssocComponent
    ],
    providers: [
        AuthService,
        UsersService,
        SupermaketsService,
        CustomerService,
        GeneralService,
        WorkOrdersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
