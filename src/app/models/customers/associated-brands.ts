import { ISku } from "./skus";
import { ISuperChain } from "../supermarkets/super-chain";
import { ISuperStore } from "../supermarkets/super-store";
import { ICustomer } from "./customers";
import { IBrand } from "./brands";

export interface IAssociatedBrands{
    id?: string;
    cadena?: ISuperChain;
    local?: ISuperStore;
    cliente?: ICustomer;
    marca?: IBrand;
    sku?: ISku[];
}