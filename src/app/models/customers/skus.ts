export interface ISku {
    id?: string;
    cliente?: string;
    marca?: string;
    sku?: string;
    descripcion?: string;
    presentacion?: string;
    sabor?: string;
    estado?: string;
    orden?: string;
}

export interface ISkuOrder {
    id?: string;
    cliente?: string;
    ds_cliente?: string;
    marca?: string;
    ds_marca?: string;
    sku?: string;
    descripcion?: string;
    presentacion?: string;
    sabor?: string;
    estado?: string;
}
