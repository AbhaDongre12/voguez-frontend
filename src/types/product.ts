export default interface Product{
    id:number,
    name: string,
    description:string,
    price: number,
    quantity:number,
    imageUrl:string,
    categoryId:number,

    category?:{
        id:number,
        name:string,
        imageUrl:string
    }
}