import { ISku } from '../customers/skus';
import { ISuperChain } from '../supermarkets/super-chain';
import { ISuperStore } from '../supermarkets/super-store';
import { ICustomer } from '../customers/customers';
import { IBrand } from '../customers/brands';

export interface IAssociatedLogs {
    id?: string;
    fecha?: string;
    accion?: string;
    cadena?: ISuperChain;
    local?: ISuperStore;
    cliente?: ICustomer;
    marca?: IBrand;
    sku?: ISku;
}