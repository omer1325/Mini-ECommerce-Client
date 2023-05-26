import { List_Product_Image } from "./list_product_images";

export class Detail_Product {
  product : Product[]
}

class Product{
    name: string;
    stock: number;
    price: number;
    productImageFiles?: List_Product_Image[];
}