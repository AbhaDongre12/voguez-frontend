export interface OrderItem{
    id:number;
    orderId:number;
    productId:number;
    quantity:number;
    price:number;
    product:{
        id:number;
        name:string;
        imageUrl:string;
    };
}