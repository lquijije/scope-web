import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomePageComponent} from './components/home-page/home-page.component';
import {LoginPageComponent} from './components/login-page/login-page.component';
import {RegisterPageComponent} from './components/register-page/register-page.component';
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {UserManPageComponent} from './components/users/user-man-page/user-man-page.component';
import {UserChangePassPageComponent} from './components/users/user-change-pass-page/user-change-pass-page.component';
import {CustomerMantPageComponent} from './components/customers/customer-mant-page/customer-mant-page.component';
import {BrandMantPageComponent} from './components/customers/brand-mant-page/brand-mant-page.component';
import {AssocBrandsPageComponent} from './components/customers/assoc-brands-page/assoc-brands-page.component';
import {SkuMantPageComponent} from './components/customers/sku-mant-page/sku-mant-page.component';
import {SuperChainPageComponent} from './components/supermarkets/super-chain-page/super-chain-page.component';
import {SuperStorePageComponent} from './components/supermarkets/super-store-page/super-store-page.component';
import {ZonePageComponent} from './components/supermarkets/zone-page/zone-page.component';
import {OrderMantPageComponent} from './components/work-orders/order-mant-page/order-mant-page.component';
import {OrderInquiryPageComponent} from './components/work-orders/order-inquiry-page/order-inquiry-page.component';
import {VisitReportPageComponent} from './components/reports/visit-report-page/visit-report-page.component';
import {PerformControlPageComponent} from './components/reports/perform-control-page/perform-control-page.component';
import {SettingsPageComponent} from './components/reports/settings-page/settings-page.component';
import {MantOrdersComponent} from './components/maintenance/mant-orders/mant-orders.component';
import {MantImagesComponent} from './components/maintenance/mant-images/mant-images.component';
import {MantBackupComponent} from './components/maintenance/mant-backup/mant-backup.component';
import {MantFixesComponent} from './components/maintenance/mant-fixes/mant-fixes.component';
import {NewVsBlockedComponent} from './components/reports/new-vs-blocked/new-vs-blocked.component';
import {AuthGuard} from './guards/auth.guard';
import {FrontReportPageComponent} from './components/reports/front-report-page/front-report-page.component';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    }, {
        path: 'login',
        component: LoginPageComponent
    }, {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'usrmant',
        component: UserManPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'usrchngpass',
        component: UserChangePassPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'customermant',
        component: CustomerMantPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'brandmant',
        component: BrandMantPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'assocbrand',
        component: AssocBrandsPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'skumant',
        component: SkuMantPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'chainmant',
        component: SuperChainPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'storemant',
        component: SuperStorePageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'ordermant',
        component: OrderMantPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'orderinquiry',
        component: OrderInquiryPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'zonemant',
        component: ZonePageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'visitrpt',
        component: VisitReportPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'frontrpt',
        component: FrontReportPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'perfcontrpt',
        component: PerformControlPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'nwvsblockrpt',
        component: NewVsBlockedComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'mntbackup',
        component: MantBackupComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'mntorders',
        component: MantOrdersComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'mntimages',
        component: MantImagesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'mntfixes',
        component: MantFixesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'settings',
        component: SettingsPageComponent,
        canActivate: [AuthGuard]
    }, {
        path: '**',
        component: NotFoundPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload',
            useHash: true
        })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
