import type Product from "./product"

export interface CartItem{
    id:number,
    userId:number,
    productId:number,
    product:Product,
    quantity:number
}