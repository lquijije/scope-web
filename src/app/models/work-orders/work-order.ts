import { ISuperChain } from "../supermarkets/super-chain";
import { ISuperStore } from "../supermarkets/super-store";
import { ICustomer } from "../customers/customers";
import { IBrand } from "../customers/brands";
import { ISku } from "../customers/skus";
import { IUser } from "../users/user";
import { IOrderStatus } from "./order-status";

export interface IWorkOrder{
    id?: string;
    cadena?: ISuperChain;
    local?: ISuperStore;
    cliente?: ICustomer;
    marca?: IBrand[];
    mercaderista?: IUser;
    fecha?: string[];
    sku?: ISku[];
    estado: IOrderStatus;
}