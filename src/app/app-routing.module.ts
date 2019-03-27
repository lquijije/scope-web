import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UserManPageComponent } from './components/users/user-man-page/user-man-page.component';
import { UserChangePassPageComponent } from './components/users/user-change-pass-page/user-change-pass-page.component';
import { CustomerMantPageComponent } from './components/customers/customer-mant-page/customer-mant-page.component';
import { BrandMantPageComponent } from './components/customers/brand-mant-page/brand-mant-page.component';
import { AssocBrandsPageComponent } from './components/customers/assoc-brands-page/assoc-brands-page.component';
import { SkuMantPageComponent } from './components/customers/sku-mant-page/sku-mant-page.component';
import { SuperChainPageComponent } from './components/supermarkets/super-chain-page/super-chain-page.component';
import { SuperStorePageComponent } from './components/supermarkets/super-store-page/super-store-page.component';
import { ZonePageComponent } from './components/supermarkets/zone-page/zone-page.component';
import { OrderMantPageComponent } from './components/work-orders/order-mant-page/order-mant-page.component';
import { OrderInquiryPageComponent } from './components/work-orders/order-inquiry-page/order-inquiry-page.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'usrmant',
    component: UserManPageComponent
  },
  {
    path: 'usrchngpass',
    component: UserChangePassPageComponent
  },
  {
    path: 'customermant',
    component: CustomerMantPageComponent
  },
  {
    path: 'brandmant',
    component: BrandMantPageComponent
  },
  {
    path: 'assocbrand',
    component: AssocBrandsPageComponent
  },
  {
    path: 'skumant',
    component: SkuMantPageComponent
  },
  {
    path: 'chainmant',
    component: SuperChainPageComponent
  },
  {
    path: 'storemant',
    component: SuperStorePageComponent
  },
  {
    path: 'ordermant',
    component: OrderMantPageComponent
  },
  {
    path: 'orderinquiry',
    component: OrderInquiryPageComponent
  },
  {
    path: 'zonemant',
    component: ZonePageComponent
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
