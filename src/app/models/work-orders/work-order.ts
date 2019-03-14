import { ISuperChain } from '../supermarkets/super-chain';
import { ISuperStore } from '../supermarkets/super-store';
import { ICustomer } from '../customers/customers';
import { IBrand } from '../customers/brands';
import { ISkuOrder } from '../customers/skus';
import { IUser } from '../users/user';
import { IOrderStatus } from './order-status';

export interface IWorkOrder {
    id?: string;
    numero?: string;
    cadena?: ISuperChain;
    local?: ISuperStore;
    mercaderista?: IUser;
    fecha?: string;
    sku?: ISkuOrder[];
    estado: IOrderStatus;
}
