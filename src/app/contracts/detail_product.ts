import { List_Product_Image } from "./list_product_images";

export class Detail_Product {
    product: Product_Detail
    productImageFiles?: List_Product_Image[];
}

export class Product_Detail{
    name: string;
    stock: number;
    price: number;
}