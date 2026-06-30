import type { OrderItem } from "./orderitem";

export default interface Order{
    id: number;
    userId:number;
    orderCode:string;
    name:string;
    totalAmount:number;
    status:string;
    createdDate:string;
    orderItems:OrderItem[];
}